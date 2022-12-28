// JavaScript数字金额转换成中文大写显示
export default function moneyToString(num) {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const radices =['', '拾', '佰', '仟', '万', '亿'];
    const bigRadices = ['', '万', '亿'];
    const decimals = ['角', '分']; // 这里只精确到分
    const cn_dollar = '元';
    const cn_integer = '整';
    // int_str = Math.floor(num).toString();
    // float_str = num % 1;
    const num_arr = num.toString().split('.');
    const int_str = num_arr[0] || '';
    let float_str = num_arr[1] || '';
    if (float_str.length > 2) {
        float_str = float_str.substr(0, 2);
    }
    let outputCharacters = '';
    if (int_str) {
        let zeroCount = 0;
        const int_len = int_str.length;
        for (var i = 0; i < int_len; i++) {
            const p = int_len - i - 1;
            d = int_str.substr(i, 1);
            const quotient = p / 4;
            modulus = p % 4;
            if (d === '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[d] + radices[modulus];
            }
            if (modulus === 0 && zeroCount < 4) {
                outputCharacters += bigRadices[quotient];
                zeroCount = 0;
            }
        }
        outputCharacters += cn_dollar;
    }
 
    if (float_str) {
        const float_len = float_str.length;
        for (let i = 0; i < float_len; i++) {
            const d = float_str.substr(i, 1);
            if (d !== '0') {
                outputCharacters += digits[d] + decimals[i];
            }          
        }
    }
 
    if (outputCharacters === '') {
        outputCharacters = digits[0] + cn_dollar;
    }
 
    if (float_str) {
        outputCharacters += cn_integer;
    }
 
    return outputCharacters;
}

