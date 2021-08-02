# RaspIO

- <a href="#general">General</a>
- <a href="#raspi">Raspberrypi API</a>
  - <a href="#usablepins">Usable Pins</a>
  - <a href="#pins.json">pins.json</a>
  - <a href="#raspiapi">API Endpoints</a>
  - <a href="#raspiinfo">Additional Information</a>
- <a href="#arduino">Arduino API</a>
  - <a href="#websockets.json">websockets.json</a>
  - <a href="#apptoraspi">App to Raspberry Pi API</a>
  - <a href="#arduinoinfo">Additional Informarion</a>
  - <a href="#raspitoarduino">Raspberry Pi to Arduino API</a>
  - <a href="#pinouts">Pinouts</a>
<br>

<h3 id="general">General</h3>
<br>

- When using the (Web)App, inputs, both from the Raspberry Pi and the Arduino, are sent through a websocket connection.

- Additional / New Arduino code is required to allow special functionality e.g. Displays, Sensors or Motors

<br>

|Endpoint|Request body|Response                                |
|--------|------------|----------------------------------------|
|`/`     | `{}`       |`{ pins: { ... }, websockets: { ... } }`|

<br>
<h2 id="raspi">Raspberry Pi API</h2>
<br>
<h3 id="usablepins">Usable Pins (physical):</h3>
3, 5, 7, 8, 10, 11,12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 40
<br>
<br>
<h3 id="pins.json">pins.json:</h3>

```json
{
    "pins": {
        "[id]":{
            "name": "String",
            "pin": "Number",
            "desc": "String",
            "type": "String (in/out)",
            "default": "Number (0/1)"
        }
    }
}
```
<br>
<h3 id="#raspiapi">Raspberry Pi API Endpoints</h3>

|Endpoint|Request body|Response|
|----------|----------|----------|
|`/addpin`|`{ name: ..., pin: ... , desc: ..., type: ..., default: ...}`|`{ id: ... }`|
|`/setpin`|`{ id: ..., props: { [property]: ..." } }`|`{ name: ..., pin: ... , desc: ..., type: ..., default: ...}`|
|`/deletepin`|`{ id: ... }`|`{ pins: { ... } }`|
|`/setpinstate`|`{ id: ..., state: ... }`|`{ name: ..., pin: ... , desc: ..., type: ..., default: ..., state: ... }` or `Nope`|
|`/getpin`|`{ id: ... }`|`{ name: ..., pin: ... , desc: ..., type: ..., default: ..., state: ... }`|

Datatypes as described in <a href="pins.json">pins.json</a> and:<br>
`state`: Number (0/1)<br>
`property`: String (Any Pin property)

<br>
<h3 id="raspiinfo">Additional Information</h3>

- When the program on the Raspberry Pi starts it will set every pin too it's specified `default` state.
- The `type` attribute is mostly for UX and UI reasons, the Raspberry Pi can still `/getpin` for an output

<br>

<h2 id="arduino">Arduino API</h2>
<br>
As soon as the node.js program on the Raspberry Pi starts, it will try to connect to all saved Arduinos through websockets, if it fails to connect it will try to reconnect every 5 seconds 4 times, if it still isn't connected it has to be manually connected through <code>/connectws</code>.
<br>
<br>
<h3 id="websockets.json">websockets.json</h3>

```json
{
    "websockets": {
        "[id/wsid]": {
            "name": "String",
            "desc": "String",
            "ip": "String",
            "hostname": "String",
            "port": "String",
            "pref": "String (IP / Hostname)",
            "input": {
                "[inputid]": {
                    "name": "String",
                    "type": "String"
                }
            },
            "output": {
                "[outputid]": {
                    "name": "String",
                    "data": {
                        "type": "Number (1-4)",
                        "id": "Number as String",
                        "value": "String"
                    }
                }
            }
        }
    }
}
```
<br>
<h3 id="apptoraspi">App to Rasperry PI API</h3>

|Endpoint|Request body|Response|
|----------|----------|----------|
|`/scan`|`{}`|`[{ name: ..., ip: ..., mac: ... }]`|
|`/testws`|`{ hostname: ..., ip: ..., port: ... }`|`{ msg: ..., method: ... }` or `{ error: ... }`
|`/connectws`|`{ id: ... }`|`{}`|
|`/addws`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... }, output: { ... } }`|`{ id: ... }`|
|`/getws`|`{ id: ... }`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... },"output": { ... } }`|
|`/setws`|`{ id: ..., props: { [property]: ... } }`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... }, output: { ... } }`|
|`/deletews`|`{ id: ... }`|`{ websockets: { ... } }`|
|`/setwsinput`|`{ wsid: ..., inputid: ..., props: { [property]: ... } }`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... }, output: { ... } }`|
|`/deletewsinput`|`{ wsid: ..., inputid: ... }`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... }, output: { ... }}`|
|`/addwsoutput`|`{ wsid: ... }`|`{ id: ..., data: { name: ..., data: { type: 0, id: 0, value: false } } }`|
|`/setwsoutput`|`{ wsid: ..., outputid: ... }`|`{ name: ..., desc: ..., ip: ..., hostname: ..., port: ..., pref: ..., input: { ... }, output: { ... }}`|
|`/executewsoutput`|`{ id: ..., data: { type: ..., id: ..., value: ... } }`|`{}`|

Datatypes as described in <a href="websockets.json">webbsockets.json</a> and:<br>
`error`: String<br>
`ip`: String<br>
`name`: String<br>
`mac`: String<br>
`hostname`: String<br>
`data.type`: Number<br>
`data.id`: Number<br>
`data.value`: String

<br>
<h3 id="arduinoinfo">Additional Information</h3>

- Inputs are declared by the Arduino when sending the value, (Web)App Clients need to refresh the page after a new input is added.
  
- `/scan` scans from the **Raspberry Pi**, because of this some devices may be missing if connected to different Reapeaters, Switches or Hubs

- `/testws` sends the first responds it gets from the Arduino and will most likely look like `13:0`.

- `/executewsoutput` data gets sent as it is on the **client** but still through the Raspberry Pi to prevent sending newer, not yet updated, information, when directly interacting with the API, not through the (Web)App, data types should match with the required ones to prevent crashes of the Arduino software. Additionally, when directly interacting with the API, it is possible to use custom properties

- `/connectws` closes the previous connection to prevent multiple connections to the same Arduino
 
<br>
<h3 id="raspitoarduino">Raspberry Pi to Arduino API</h3>
<br>


The Raspberry Pi sends data to the Arduino through websocket connections in JSON format (`{ type: ..., id: ..., value: ... }`) but receives information in `id:value` format. When `type = 3` there is no `value` parameter.

All usable pins for `type 0, 1, 4` have to be declared in the `usablepins` array in the `json.h`.

To use `type, 2` and `3` and variables and functions need to be added to the corresponding arrays

<br>
<br>
<br>

<h1 id="pinouts">PINS MUST BE IN PHYSICAL FORMAT</h1>

## WeMos D1 Mini:
<img src="https://i2.wp.com/randomnerdtutorials.com/wp-content/uploads/2019/05/ESP8266-WeMos-D1-Mini-pinout-gpio-pin.png?quality=100&strip=all&ssl=1"/>
<br>
<br>
<br>

## WeMos D1 R1:
<img src="https://eeeboxbd.com/wp-content/uploads/2019/07/WeMos-D1-R1-WiFi-Development-Board-2.jpg"/>