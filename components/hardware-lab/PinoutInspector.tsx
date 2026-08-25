'use client';

import React, { useState } from 'react';
import { Cpu, Info, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

interface BoardPinout {
  id: string;
  name: string;
  chip: string;
  operatingVoltage: string;
  clockSpeed: string;
  flashMemory: string;
  pins: {
    name: string;
    type: 'digital' | 'analog' | 'pwm' | 'power' | 'ground' | 'communication';
    voltage: string;
    description: string;
    safetyTip: string;
  }[];
}

const BOARDS_DATA: BoardPinout[] = [
  {
    id: 'arduino-uno',
    name: 'Arduino UNO R3',
    chip: 'ATmega328P (8-bit AVR)',
    operatingVoltage: '5V DC',
    clockSpeed: '16 MHz',
    flashMemory: '32 KB',
    pins: [
      { name: 'Pin D0 (RX)', type: 'communication', voltage: '5V', description: 'Serial Receive Line. Used to flash firmware & read USB serial data.', safetyTip: 'Do not connect sensors to D0 while uploading code!' },
      { name: 'Pin D1 (TX)', type: 'communication', voltage: '5V', description: 'Serial Transmit Line. Sends serial bytes to PC / WebSerial.', safetyTip: 'Disconnect external bluetooth modules when flashing code.' },
      { name: 'Pin D3 (PWM)', type: 'pwm', voltage: '5V', description: 'Pulse Width Modulation output. Ideal for DC motor speed control & dimming LEDs.', safetyTip: 'Maximum current output per pin is 40mA.' },
      { name: 'Pin D9 (PWM)', type: 'pwm', voltage: '5V', description: 'Servo Motor Control Signal line. Attach SG90 Servo orange wire here.', safetyTip: 'Requires Servo.h library in Arduino IDE.' },
      { name: 'Pin A0 (ADC)', type: 'analog', voltage: '0-5V', description: '10-bit Analog-to-Digital input (Reads 0 to 1023 integer values).', safetyTip: 'Do not exceed 5V on analog input pins.' },
      { name: '5V Power Rail', type: 'power', voltage: '5V', description: 'Regulated 5V DC output power pin for breadboard & sensors.', safetyTip: 'Never short 5V directly to GND pin!' },
      { name: 'GND (Ground)', type: 'ground', voltage: '0V', description: 'Common electrical ground reference.', safetyTip: 'Connect all module GND pins to Arduino GND.' }
    ]
  },
  {
    id: 'esp32-devkit',
    name: 'ESP32 DevKit V1',
    chip: 'Xtensa Dual-Core 32-bit LX6',
    operatingVoltage: '3.3V DC',
    clockSpeed: '240 MHz',
    flashMemory: '4 MB Flash + 520 KB SRAM',
    pins: [
      { name: 'GPIO 2', type: 'digital', voltage: '3.3V', description: 'Onboard Blue LED & General Purpose Digital IO.', safetyTip: 'Must be LOW during boot to enter flashing mode.' },
      { name: 'GPIO 21 (SDA)', type: 'communication', voltage: '3.3V', description: 'I2C Serial Data Line for OLED displays & IMU sensors.', safetyTip: 'Requires 4.7k ohm pull-up resistor on I2C bus.' },
      { name: 'GPIO 22 (SCL)', type: 'communication', voltage: '3.3V', description: 'I2C Serial Clock Line.', safetyTip: '3.3V logic level strictly enforced!' },
      { name: 'GPIO 34 (ADC1)', type: 'analog', voltage: '0-3.3V', description: 'Input-Only 12-bit ADC Pin (Reads 0 to 4095).', safetyTip: 'Input only — cannot be used as digital output!' },
      { name: '3V3 Power Rail', type: 'power', voltage: '3.3V', description: 'Regulated 3.3V power output for sensors.', safetyTip: 'Do not feed 5V directly into ESP32 GPIOs.' },
      { name: 'GND', type: 'ground', voltage: '0V', description: 'Common Ground Reference pin.', safetyTip: 'Ensure common ground for external relays.' }
    ]
  },
  {
    id: 'raspberry-pi-pico',
    name: 'Raspberry Pi Pico',
    chip: 'RP2040 Dual ARM Cortex-M0+',
    operatingVoltage: '3.3V DC',
    clockSpeed: '133 MHz',
    flashMemory: '2 MB Flash + 264 KB SRAM',
    pins: [
      { name: 'GP0 (UART0 TX)', type: 'communication', voltage: '3.3V', description: 'Hardware UART Serial Transmit line.', safetyTip: 'Compatible with MicroPython & C++ SDK.' },
      { name: 'GP25 (Onboard LED)', type: 'digital', voltage: '3.3V', description: 'Internal green LED indicator pin.', safetyTip: 'Toggles with Machine.Pin(25) in MicroPython.' },
      { name: 'ADC0 (GP26)', type: 'analog', voltage: '0-3.3V', description: '12-bit Analog-to-Digital input pin.', safetyTip: 'Clean low-noise analog power rail.' },
      { name: '3V3_OUT', type: 'power', voltage: '3.3V', description: 'Main 3.3V regulated system power supply.', safetyTip: 'Max output current ~300mA.' }
    ]
  }
];

export const PinoutInspector: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardPinout>(BOARDS_DATA[0]);
  const [activePin, setActivePin] = useState(BOARDS_DATA[0].pins[0]);

  const handleSelectBoard = (board: BoardPinout) => {
    setSelectedBoard(board);
    setActivePin(board.pins[0]);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-6">
      
      {/* Header & Board Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Interactive Board Pinout Inspector</h2>
            <p className="text-xs text-gray-400">
              Inspect microcontroller pinout specs, electrical safety limits, and circuit wiring paths.
            </p>
          </div>
        </div>

        {/* Board Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          {BOARDS_DATA.map((board) => (
            <button
              key={board.id}
              onClick={() => handleSelectBoard(board)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBoard.id === board.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {board.name}
            </button>
          ))}
        </div>
      </div>

      {/* Board Hardware Specs Overview Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Main Processor</span>
          <span className="text-xs font-bold text-white mt-0.5 block truncate">{selectedBoard.chip}</span>
        </div>

        <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Operating Voltage</span>
          <span className="text-xs font-bold text-cyan-400 mt-0.5 block">{selectedBoard.operatingVoltage}</span>
        </div>

        <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Clock Frequency</span>
          <span className="text-xs font-bold text-amber-400 mt-0.5 block">{selectedBoard.clockSpeed}</span>
        </div>

        <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Flash Storage</span>
          <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{selectedBoard.flashMemory}</span>
        </div>
      </div>

      {/* Main Interactive Pinout Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Pin List Selector (5 cols) */}
        <div className="md:col-span-5 bg-gray-950 p-4 rounded-2xl border border-gray-800 flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Click Pin to Inspect
          </span>

          <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1">
            {selectedBoard.pins.map((pin, idx) => (
              <button
                key={idx}
                onClick={() => setActivePin(pin)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  activePin.name === pin.name
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-gray-900/60 border-gray-800/80 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{pin.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">{pin.type} • {pin.voltage}</span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  pin.type === 'power' ? 'bg-red-400 shadow-[0_0_8px_#f87171]' :
                  pin.type === 'ground' ? 'bg-gray-400' :
                  pin.type === 'pwm' ? 'bg-amber-400' :
                  pin.type === 'analog' ? 'bg-cyan-400' : 'bg-purple-400'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Pin Deep Dive Info Box (7 cols) */}
        <div className="md:col-span-7 bg-gray-950 p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{activePin.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                  {activePin.type}
                </span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                Logic Level: {activePin.voltage}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Function Description
              </span>
              <p className="text-xs text-gray-200 leading-relaxed bg-gray-900/80 p-3.5 rounded-xl border border-gray-800">
                {activePin.description}
              </p>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Electrical Safety Guideline
                </span>
                <p className="text-xs text-gray-300 mt-0.5">{activePin.safetyTip}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Hardware Layout
            </span>
            <span>Kite Robotics Hardware Standard</span>
          </div>
        </div>

      </div>

    </div>
  );
};
