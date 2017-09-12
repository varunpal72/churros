//shamelessly copied from the internet
const jsSHA = require('jssha');

let dec2hex = (s) => (s < 15.5 ? "0" : "") + Math.round(s).toString(16);


let hex2dec = s => parseInt(s, 16);


let leftpad = (s, l, p) => {
    if(l + 1 >= s.length) {
        s = Array(l + 1 - s.length).join(p) + s;
    }
    return s;
};


let base32tohex = (base32) => {
    let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let hex = "";
    for(let i = 0; i < base32.length; i++) {
        let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }
    for(let i = 0; i + 4 <= bits.length; i+=4) {
        let chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
    }
    return hex;
};

exports.getOTP = secret =>  {
    let otp;
    try {
        let epoch = Math.round(new Date().getTime() / 1000.0);
        let time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
        let hmacObj = new jsSHA(time, "HEX");
        let hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
        let offset = hex2dec(hmac.substring(hmac.length - 1));
        otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
        otp = otp.substr(otp.length - 6, 6);

    } catch (error) {
        throw error;
    }
    return otp;
};

