var EmployeeView = function (employee) {

    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '.add-location-btn', this.addLocation);
        this.$el.on('click', '.change-pic-btn', this.changePicture);
        this.$el.on('click', '.bluetooth-test-btn', this.testBLE);

    };

    this.render = function () {
        this.$el.html(this.template(employee));
        return this;
    };

    this.addLocation = function (event) {
        event.preventDefault();

        function gpsSuccess(position) {
            alert('Latitude: ' + position.coords.latitude + "\n" +
                'Longitude: ' + position.coords.longitude + "\n" +
                'Altitude: ' + position.coords.altitude + "\n" +
                'Accuracy: ' + position.coords.accuracy + "\n" +
                'Timestamp: ' + position.timestamp + "\n");
        }

        function gpsError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        let gpsOptions = {
            maximumAge: 300000,
            timeout: 5000,
            enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError, gpsOptions);
        return false;
    };

    this.changePicture = function (event) {
        event.preventDefault();
        if (!navigator.camera) {
            alert("Camera API not supported", "Error");
            return;
        }
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0 // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            function (imgData) {
                $('.media-object', this.$el).attr('src', "data:image/jpeg;base64," + imgData);
            },
            function () {
                alert('Error taking picture', 'Error');
            },
            options);

        return false;
    };

    this.testBLE = function () {
        var scanFail = function () {
            console.log("Scan failed!");
        };

        var connectFail = function () {
            console.log("Connect failed!");
        };

        var notifyfail = function () {
            console.log("Notify failed!");
        }

        ble.scan([], 10, function (device) {
            console.log(JSON.stringify(device));

            if ("BLEEnv" === device.name) {
                ble.connect(device.id, function () {
                    console.log("Connect success!");

                    ble.startNotification(device.id, "0000ffe0-0000-1000-8000-00805f9b34fb", "0000ffe1-0000-1000-8000-00805f9b34fb", function (buffer) {
                        var data = String.fromCharCode.apply(null, new Uint8Array(buffer));
                        console.log("Received:" + data);
                    }, notifyfail)
                }, connectFail);
            }
        }, scanFail);
    };

    this.initialize();

}