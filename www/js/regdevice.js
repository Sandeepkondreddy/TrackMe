var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#txtuuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
}
function callback(imei) {
    $("#txtimei").val(imei);
}
function onBackKeyDown() {
}
function qs() {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0, pos);
            var val = parms[i].substring(pos + 1);
            qsParm[key] = val;
        }
    }
    if (parms.length > 0) {
        $("#hidusrid").val(atob(qsParm["user"]));
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
$(document).ready(function () {
    $("#loading").hide();
    qs();
    //GetDeviceStatus();

    $("#home").click(function () {
        $.ajax({
            type: "GET",
			url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),
            //url: "http://202.83.27.199/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
	        //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });

    $("#btnSubmit").click(function (){
        //var _loctype = $("#selLocType option:selected").val();
        //if(_loctype == 0) {
        //    $("#selLocType").focus();
        //    alert('Please Select Location Type.');
        //    return false;
        //}
        //else {
            $(this).find("i.fa").attr('class', 'fa fa-spinner fa-spin');
            $(this).find("span").text(" device is registering please wait...");
            $(this).attr('disabled', true);
            $(this).attr('class', 'btn btn-custom-icon');
            $("#loading").show();
            var Adddata = {};
            Adddata.IMEI = $("#txtimei").val();
            Adddata.UUID = $("#txtuuid").val();
            //Adddata.LocationType = _loctype;
            Adddata.User = $("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Device/RegisterDevice',
                dataType: "json",
                data: Adddata,
                success: function (loctyperesult) {
                    alert('Device Registered Successfully');
                },
                error: function (xhr, status, error) {
                    $("#btnSubmit").prop('disabled', false);
                    alert('Error Occurred while Registring device.\n\r' + xhr.responseText);
                }
            });
        //}
        $(this).find("i.fa").attr('class', 'fa fa-check');
        $(this).find("span").text(" Submit");
        $(this).attr('disabled', false);
        $(this).attr('class', 'btn btn-custom');
        $("#loading").hide();
    });
	
	$("#Logout").click(function() {
			SaveAppAccessLog();
		});
});

/* function ValidateDevice(){
    var Adddata = {};
    Adddata.IMEI = $("#txtimei").val();
    Adddata.UUID = $("#txtuuid").val();
    $.ajax({
        type: "POST",
        url: "http://apps.kpcl.com/KPCLOpsAPI/api/Device/ValidateDevice",
	//url: "http://182.72.244.25/KPCTSDS/api/Account/GetDeviceStatus",
        dataType: "json",
        data: Adddata,
        success: function (result) {          
			if (result != "--") {
                alert('Device Already Registered.');
            }
            else {
				alert('Device Not Registered, Please contact IT Team.');
            } 
        },
        error: function () {
            alert('Error Occurred while getting Device Status');
        }
    });
} */

function ValidateDevice(){
					$.ajax({
                                type: "GET",
								url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/DeviceValidate/" + $("#txtimei").val()+"/"+$("#txtuuid").val(),
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {
									if (result == "Registered") {
										//alert('Device Already Registered.');
										
										//$("#btnSubmit").attr('disabled',false);
										}
										else {
											alert('Device Not Registered, Please contact IT Team.');$("#loading").hide();
											//$("#btnSubmit").attr('disabled',true);
										} 
                                    
                                },
								error: function () {
									alert('Error Occurred while getting Details');
								}
     });

}

function SaveAppAccessLog() // Function For Application Access Log detials
		{
			var Adddata = {};
            //Adddata.IMEI = '999';
            //Adddata.UUID = 'sss022';
			Adddata.IMEI = $("#txtimei").val();
            Adddata.UUID = $("#txtuuid").val();
            Adddata.AppAccessType = 'Out';
			//alert($("#txtimei").val());
			//alert($("#txtuuid").val());
			//alert($("#hidusrid").val());
            Adddata.User =$("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/KPCLOpsAPI/api/User/ApplicationAccLog',
				//url: 'http://localhost:51594/api/User/ApplicationAccLog',
                dataType: "json",
                data: Adddata,
                success: function (result) {
                    //alert('Access Log Saved Successfully');
                },
                error: function (xhr, status, error) {
                    //$("#btnSubmit").prop('disabled', false);
                    //alert('Error Occurred while Saving Access Log.\n\r' + xhr.responseText);
                }
            });
		}