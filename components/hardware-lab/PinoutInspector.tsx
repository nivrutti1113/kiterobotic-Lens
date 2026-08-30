'use client';

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Layers, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans text-[#374151]">
      
      {/* Header & Board Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EEDCD0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] font-heading">Interactive Board Pinout Inspector</h2>
            <p className="text-xs text-[#374151] font-semibold">
              Inspect microcontroller pinout specs, electrical safety limits, and circuit wiring paths.
            </p>
          </div>
        </div>

        {/* Board Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF3EC] p-1.5 rounded-2xl border border-[#EEDCD0] font-heading">
          {BOARDS_DATA.map((board) => (
            <button
              key={board.id}
              onClick={() => handleSelectBoard(board)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedBoard.id === board.id
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-[#374151] hover:text-purple-900'
              }`}
            >
              {board.name}
            </button>
          ))}
        </div>
      </div>

      {/* Board Hardware Specs Overview Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FAF3EC] p-3.5 rounded-2xl border border-[#EEDCD0]">
          <span className="text-[10px] uppercase font-black text-[#4B5563] block font-heading">Main Processor</span>
          <span className="text-xs font-black text-[#111827] mt-0.5 block truncate font-heading">{selectedBoard.chip}</span>
        </div>

        <div className="bg-[#FAF3EC] p-3.5 rounded-2xl border border-[#EEDCD0]">
          <span className="text-[10px] uppercase font-black text-[#4B5563] block font-heading">Operating Voltage</span>
          <span className="text-xs font-black text-purple-900 mt-0.5 block font-heading">{selectedBoard.operatingVoltage}</span>
        </div>

        <div className="bg-[#FAF3EC] p-3.5 rounded-2xl border border-[#EEDCD0]">
          <span className="text-[10px] uppercase font-black text-[#4B5563] block font-heading">Clock Frequency</span>
          <span className="text-xs font-black text-amber-800 mt-0.5 block font-heading">{selectedBoard.clockSpeed}</span>
        </div>

        <div className="bg-[#FAF3EC] p-3.5 rounded-2xl border border-[#EEDCD0]">
          <span className="text-[10px] uppercase font-black text-[#4B5563] block font-heading">Flash Storage</span>
          <span className="text-xs font-black text-emerald-800 mt-0.5 block font-heading">{selectedBoard.flashMemory}</span>
        </div>
      </div>

      {/* Main Interactive Pinout Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Pin List Selector (5 cols) */}
        <div className="md:col-span-5 bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] flex flex-col gap-3">
          <span className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2 font-heading">
            <Layers className="w-4 h-4 text-purple-700" /> Click Pin to Inspect
          </span>

          <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1 font-semibold">
            {selectedBoard.pins.map((pin, idx) => (
              <button
                key={idx}
                onClick={() => setActivePin(pin)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  activePin.name === pin.name
                    ? 'bg-purple-700 text-white border-purple-800 shadow-md font-bold'
                    : 'bg-white border-[#EEDCD0] text-[#374151] hover:bg-purple-100/50'
                }`}
              >
                <div>
                  <span className="text-xs font-black block font-heading">{pin.name}</span>
                  <span className="text-[10px] opacity-80 font-mono uppercase">{pin.type} • {pin.voltage}</span>
                </div>
                <span className={`w-3 h-3 rounded-full border border-slate-300 ${
                  pin.type === 'power' ? 'bg-rose-500' :
                  pin.type === 'ground' ? 'bg-slate-700' :
                  pin.type === 'pwm' ? 'bg-amber-500' :
                  pin.type === 'analog' ? 'bg-cyan-500' : 'bg-purple-500'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Pin Deep Dive Info Box (7 cols) */}
        <div className="md:col-span-7 bg-purple-100/70 p-6 rounded-2xl border border-purple-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-purple-300">
              <h3 className="text-base font-black text-purple-950 flex items-center gap-2 font-heading">
                <span>{activePin.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200 text-purple-950 font-black uppercase">
                  {activePin.type}
                </span>
              </h3>
              <span className="text-xs font-mono text-purple-950 font-black bg-white px-3 py-1 rounded-lg border border-purple-300">
                Logic Level: {activePin.voltage}
              </span>
            </div>

            <div>
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider block mb-1 font-heading">
                Function Description
              </span>
              <p className="text-xs text-[#374151] leading-relaxed bg-white p-3.5 rounded-xl border border-purple-200 font-semibold shadow-sm">
                {activePin.description}
              </p>
            </div>

            <div className="bg-amber-100/80 border border-amber-300 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider block font-heading">
                  Electrical Safety Guideline
                </span>
                <p className="text-xs text-[#374151] mt-0.5 font-semibold">{activePin.safetyTip}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-300 flex items-center justify-between text-[11px] text-[#4B5563] font-bold">
            <span className="flex items-center gap-1 text-emerald-800 font-black">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Hardware Layout
            </span>
            <span>Kite Robotics Hardware Standard</span>
          </div>
        </div>

      </div>

    </div>
  );
};
