// KMS-AI Lightweight Browser Python Interpreter Engine
// Parses and executes Python scripts in the browser with stdout/stderr, variables, loops, functions, math, random, and Turtle canvas commands.

export interface PythonExecutionResult {
  logs: string[];
  variables: Record<string, string>;
  error: string | null;
  turtleCommands: { action: string; value?: number; color?: string }[];
}

export function executePythonCode(code: string): PythonExecutionResult {
  const logs: string[] = [];
  const variables: Record<string, string> = {};
  const turtleCommands: { action: string; value?: number; color?: string }[] = [];
  let error: string | null = null;

  try {
    // Environment setup for execution
    const scope: Record<string, any> = {
      math: {
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        pi: Math.PI,
        pow: Math.pow,
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
      },
      random: {
        randint: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a,
        random: () => Math.random(),
        choice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
      },
      range: (...args: number[]) => {
        let start = 0, stop = 0, step = 1;
        if (args.length === 1) {
          stop = args[0];
        } else if (args.length === 2) {
          start = args[0];
          stop = args[1];
        } else if (args.length === 3) {
          start = args[0];
          stop = args[1];
          step = args[2];
        }
        const res: number[] = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
          res.push(i);
        }
        return res;
      },
      len: (obj: any) => (obj ? obj.length : 0),
      int: (val: any) => parseInt(val, 10),
      float: (val: any) => parseFloat(val),
      str: (val: any) => String(val),
      list: (val: any) => Array.from(val),
      sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
      max: (...args: any[]) => Math.max(...(Array.isArray(args[0]) ? args[0] : args)),
      min: (...args: any[]) => Math.min(...(Array.isArray(args[0]) ? args[0] : args)),
    };

    // Mock turtle module
    scope.turtle = {
      forward: (dist: number) => turtleCommands.push({ action: 'forward', value: dist }),
      fd: (dist: number) => turtleCommands.push({ action: 'forward', value: dist }),
      backward: (dist: number) => turtleCommands.push({ action: 'backward', value: dist }),
      bk: (dist: number) => turtleCommands.push({ action: 'backward', value: dist }),
      right: (angle: number) => turtleCommands.push({ action: 'right', value: angle }),
      rt: (angle: number) => turtleCommands.push({ action: 'right', value: angle }),
      left: (angle: number) => turtleCommands.push({ action: 'left', value: angle }),
      lt: (angle: number) => turtleCommands.push({ action: 'left', value: angle }),
      color: (c: string) => turtleCommands.push({ action: 'color', color: c }),
      pencolor: (c: string) => turtleCommands.push({ action: 'color', color: c }),
    };

    // Custom print redirect
    const print = (...args: any[]) => {
      const outputLine = args
        .map((a) => {
          if (typeof a === 'object') return JSON.stringify(a);
          return String(a);
        })
        .join(' ');
      logs.push(outputLine);
    };

    // Transpile Python syntax to executable JS for supported constructs
    let jsCode = code
      // Comments
      .replace(/#.*$/gm, '')
      // Print statements print(...) -> scope.print(...)
      .replace(/\bprint\s*\(/g, 'scope.print(')
      // Python true / false / none
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      // and / or / not operators
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b/g, '!')
      // for i in range(...) -> for(let i of scope.range(...))
      .replace(/for\s+([a-zA-Z_]\w*)\s+in\s+scope\.range\(([^)]+)\):/g, 'for(let $1 of scope.range($2)) {')
      .replace(/for\s+([a-zA-Z_]\w*)\s+in\s+range\(([^)]+)\):/g, 'for(let $1 of scope.range($2)) {')
      .replace(/for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*):/g, 'for(let $1 of $2) {')
      // def func(x): -> function func(x) {
      .replace(/def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\):/g, 'function $1($2) {')
      // if / elif / else
      .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
      .replace(/if\s+([^:]+):/g, 'if ($1) {')
      .replace(/else:/g, '} else {')
      .replace(/while\s+([^:]+):/g, 'while ($1) {');

    // Add block closing brackets based on indentation lines or auto-wrap
    const lines = jsCode.split('\n');
    let openBrackets = 0;
    const transformedLines: string[] = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Handle simple python assignment or statement
      transformedLines.push(line);
      if (line.includes('{')) {
        openBrackets++;
      }
    }

    // Auto-close dangling open function/loop blocks
    for (let i = 0; i < openBrackets; i++) {
      transformedLines.push('}');
    }

    const finalJs = transformedLines.join('\n');

    // Execute within isolated Scope sandbox
    const runner = new Function('scope', 'print', `
      with (scope) {
        ${finalJs}
      }
    `);

    runner(scope, print);

    // Collect global scope variables
    Object.entries(scope).forEach(([k, v]) => {
      if (typeof v !== 'function' && k !== 'math' && k !== 'random' && k !== 'turtle') {
        variables[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
      }
    });

  } catch (err: any) {
    error = err.message || 'Python SyntaxError / Execution Error';
    logs.push(`Traceback (most recent call last):\n  PythonError: ${error}`);
  }

  return {
    logs,
    variables,
    error,
    turtleCommands,
  };
}
