/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function convertVASTTimeToMillis(time: string): number {
    const hourStr = time.split(':')[0];
    const minStr = time.split(':')[1];
    let secStr = time.split(':')[2];
    let milliStr = '0';
  
    if (secStr.split('.').length === 2) {
      milliStr = secStr.split('.')[1];
      secStr = secStr.split('.')[0];
    }
  
    return (Number(hourStr) * 3600000) + (Number(minStr) * 60000) +
        (Number(secStr) * 1000) + Number(milliStr);
  }
  
  export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function assertString(val: any): asserts val is string {
    if (typeof val !== "string") {
        throw new Error("Not a string!");
    }
  }

  export function assertNumber(val: any): asserts val is number {
    if (typeof val !== 'number') {
      throw new Error("Not a number!");
    }
  }

  export function assertDefined<T>(val: T): asserts val is NonNullable<T> {
    if (val === undefined || val === null) {
        throw new Error(
            `Expected 'val' to be defined, but received ${val}`
        );
    }
  }