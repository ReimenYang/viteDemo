const { ipcMain } = require('electron')
const { SerialPort, ByteLengthParser, CCTalkParser, DelimiterParser, InterByteTimeoutParser, PacketLengthParser, ReadlineParser, ReadyParser, RegexParser } = require('serialport')
/** serialport api
 * ByteLengthParser: 以收到的数据长度为单位进行解析,
 * CCTalkParser: 解析 ccTalk 格式数据,
 * DelimiterParser: 以指定字符为界限处理数据,
 * InterByteTimeoutParser: 指定时间未收到数据触发解析,
 * PacketLengthParser: [Getter],
 * ReadlineParser: 以行为单位解析数据，默认行分隔符为 /n，可以使用 delimiter,
 * ReadyParser: 以开始标志进行解析,
 * RegexParser: 以正则表达式为分隔进行解析,
 * SlipDecoder: [Getter],
 * SlipEncoder: [Getter],
 * SpacePacketParser: [Getter],
 * SerialPortMock: [Getter],
 * SerialPort: [Getter]
*/



module.exports = function () {
  ipcMain.handle('serialportList', async () => {
    const portList = await SerialPort.list()
    console.log(portList);
    // [
    //   {
    //     path: 'COM5',
    //     manufacturer: 'Prolific',
    //     serialNumber: '6&1AEE5228&0&1',
    //     pnpId: 'USB\\VID_067B&PID_2303\\6&1AEE5228&0&1',
    //     locationId: 'Port_#0001.Hub_#0002',
    //     friendlyName: 'Prolific USB-to-Serial Comm Port (COM5)',
    //     vendorId: '067B',
    //     productId: '2303'
    //   }
    // ]
    return portList
  })

  ipcMain.handle('serialportOpen', async (event, config, ...args) => {
    if (!config) config = { pipeType: 'ReadlineParser' }
    const port = new SerialPort(...args);
    port.open(err => err ? console.log('open err:' + err) : console.log('open ok'))
    let option = config.option || {
      ByteLength: { length: 8 },
      CCTalk: 100,
      Delimiter: { delimiter: '\0' },//delimiter选项可以是 string|Buffer|number[] ；includeDelimiter选项表示数据中是否包含分隔符，默认不包含。
      InterByteTimeout: { interval: 2000 },
      PacketLength: {},//{ delimiter:0xaa, packetOverhead:2, lengthBytes:1, lengthOffset:1, maxLen:0xff }
      Readline: { delimiter: '\0' },
      Ready: {},//{ delimiter: 'READY' }
      Regex: {},//{ regex: /[\r\n]+/ }
    }[config.pipeType]
    let pipe
    switch (config.pipeType) {
      case 'ByteLength':
        pipe = new ByteLengthParser(option);
        break;
      case 'CCTalk':
        pipe = new CCTalkParser(option);
        break;
      case 'Delimiter':
        pipe = new DelimiterParser(option);
        break;
      case 'InterByteTimeout':
        pipe = new InterByteTimeoutParser(option);
        break;
      case 'PacketLength':
        pipe = new PacketLengthParser(option);
        break;
      case 'Readline':
        pipe = new ReadlineParser(option);
        break;
      case 'Ready':
        pipe = new ReadyParser(option);
        break;
      case 'Regex':
        pipe = new RegexParser(option);
        break;
      default:
        pipe = new ReadlineParser({ delimiter: '\0' });
        break;
    }

    const parser = port.pipe(pipe);
    // 每收到8个字节触发
    // const parser = port.pipe(new ByteLengthParser({ length: 8 }));

    // 2000毫秒未接到数据触发//maxBufferSize选项用于指定接收到该数量数据后就算没有超时也将触发动作。
    // const parser = port.pipe(new InterByteTimeoutParser({ interval: 2000 }));

    // 以 /n 分隔处理数据
    // const parser = port.pipe(new DelimiterParser(option));
    // const parser = port.pipe(new ReadlineParser(option));

    // 使用read方法读取数据，可以指定读取字节数
    // port.on('readable', () => {console.log(port.read(), 111);});

    // 以 flowing mode 监听收到的数据
    parser.on('data', data => {
      // console.log(config.pipeType, data.toString())
      event.sender.send('portReply', { ...config, data: data.toString() });
      // 在页面的js
      // ipcRenderer.on("portReply", (event, ...args) => {console.log("渲染进程收到的数据:", args);})
    });
  })

  ipcMain.handle('serialportSend', async (event, ...args) => {
    const port = new SerialPort(...args);
    // port.write('DATA:r,114\r\n\0'); // 发送字符串
    port.write(Buffer.from('DATA:r,114\r\n\0')); // 发送Buffer数据
    // port.write(new Uint8Array([0x48, 0x69, 0x21, 0x0A])); // 发送字节数组

    port.drain(err => err ? console.log('send err:' + err) : console.log('send ok'))
  })
}

