export default class BLEDataParser {
    constructor(rawData) {
      this.rawData = rawData;
  
      this.pairedData =  this.pairData();
  
      this.parsedData = {
        Flag: {
          FlagDataLength: this.getDataLength(this.readPairedData(0)),
          FlagDataType: this.readPairedData(1),
          FlagData: this.readPairedData(2)
        },
        UUID:{
          UUIDDataLength: this.getDataLength(this.readPairedData(3)),
          UUIDsList: this.readPairedData(4, false),
          UUIDData: this.readPairedData(5, false,6).join("")
        },
        InfoDataLength: this.readPairedData(7),
        ServiceData: this.readPairedData(8, false),
        UUIDData: this.readPairedData(9, false, 10).join(""),
        FrameType: this.readPairedData(11),
        VersionNumber: this.readPairedData(12),
        BatteryLevel: this.readPairedData(13),
        MacAddress: this.readPairedData(14, false, 19).join(":"),
        Name: this.readPairedData(20, false, this.pairedData.length-1).join("")
      }
    }
  
    getDataLength(dataLength) {
      if (dataLength !== dataLength) {
        throw `Data Length is not ${dataLength} as specified by documentation`;
      }
      return dataLength;
    }
  
    readPairedData(pairedDataStartIndex, toInt=true, pairedDataEndIndex = -1){
      if(pairedDataEndIndex === -1){
        if(toInt) return parseInt(this.pairedData[pairedDataStartIndex], 16);
        else return this.pairedData[pairedDataStartIndex];
      } else {
        return this.pairedData.slice(pairedDataStartIndex, pairedDataEndIndex+1);
      }
    }
  
    pairData(){
      let acc = [];
      for (let i = 0; i < this.rawData.length; i+=2) {
        acc.push(this.rawData[i] + this.rawData[i + 1]);
      }
      return acc
    }
  }
  