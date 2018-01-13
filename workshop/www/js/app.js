// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
    EmployeeView.prototype.template = Handlebars.compile($("#employee-tpl").html());

    var service = new EmployeeService();

    service.initialize().done(function () {
        router.addRoute('', function() {
            $('body').html(new HomeView(service).render().$el);
        });

        router.addRoute('employees/:id', function(id) {
            service.findById(parseInt(id)).done(function(employee) {
                $('body').html(new EmployeeView(employee).render().$el);
            });
        });
        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        console.log("Device is ready!");
        testBLE();
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */
    function testBLE() {
        var scanFail =  function() {
            console.log("Scan failed!");
        };

        var connectFail = function() {
            console.log("Connect failed!");
        };

        var notifyfail = function() {
            console.log("Notify failed!");
        }

        ble.scan([], 10, function(device) {
            console.log(JSON.stringify(device));

            if ("BLEEnv" === device.name) {
                ble.connect(device.id, function() {
                    console.log("Connect success!");

                    ble.startNotification(device.id, "0000ffe0-0000-1000-8000-00805f9b34fb", "0000ffe1-0000-1000-8000-00805f9b34fb", function(buffer) {
                        var data = String.fromCharCode.apply(null, new Uint8Array(buffer));
                        console.log("Received:" + data);
                    }, notifyfail)
                }, connectFail);
            }
        }, scanFail);
    }

}());