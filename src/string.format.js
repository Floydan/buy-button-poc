(function (String) {
    var $type = String;
    var $prototype = $type.prototype;

    $prototype.format = function (args) {
        var format = this.toString();
        if (typeof arguments[0] == 'object') {
            for (var prop in arguments[0]) {
                format = format.replace(new RegExp('\\{' + prop + '\\}', 'g'), arguments[0][prop]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (i < arguments.length) {
                    format = format.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
                }
            }
        }
        return format;
    };

    $type.format = function (format, args) {
        if (typeof arguments[0] == 'object') {
            for (var prop in arguments[0]) {
                format = format.replace(new RegExp('\\{' + prop + '\\}', 'g'), arguments[0][prop]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if ((i + 1) < arguments.length) {
                    format = format.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i + 1]);
                }
            }
        }
        return format;
    };
})(String || {});