var qsParm = new Array(), oldvalue = "";
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
    nfc.enabled(function(){        
        lblMsg.innerHTML = "Tap nfc tag to read";
        nfc.addNdefListener(
            function (record){
                $("#loading").show();
                txttruckno.value = "";
                var tagdata = record.tag.ndefMessage[0]["payload"];
                var label = document.createTextNode(nfc.bytesToString(tagdata));
                txttag.value=label.data.substring(3);
                txttruckno.value="";
                lblMsg.innerHTML = "";
                //btnSubmit.style.display = 'none';
                //btnClear.style.display = 'none';
				GetTagDetails(label.data.substring(3));//Added for fetching tag details on NFC read

                $("#loading").hide();
            },
            function(){
                lblMsg.innerHTML = "";
            },
            function(){
                lblMsg.innerHTML = "Error in reading tag.";
        });
    },
    function(){
        lblMsg.innerHTML = "";
    });
	document.addEventListener("backbutton", onBackKeyDown, false);
}

function callback(imei) {
    $("#hidDeviceId").val(imei);
	//alert(imei);
	$("#hidimei").val(imei);	
}

function scanTag()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                 $("#txttruckno").val("");
                 $("#txttag").val(result.text);
				 GetTagDetails(result.text);				 
				 
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

function scanTruck()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                $("#txttruckno").val(result.text);
                $("#txttag").val("");
                GetTruckDetails(result.text.toUpperCase());//Added for fetching truck details on QR-Code Scan
				
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

function SaveOperationDetails(){
	//alert('Save: SaveOperationDetails');
	var Adddata = {};
			Adddata.VTId= document.getElementById('hidVTId').value;
			Adddata.StageId=document.getElementById('hidNStageId').value;
			Adddata.DeviceId = document.getElementById('hidDeviceId').value;
			Adddata.Remarks = $("#txtremarks").val();
			Adddata.Operation=$("#txtOperation").val();
          
            Adddata.UserId = $("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/SaveOperationDetails',		
                dataType: "json",
                data: Adddata,
                success: function (result) {
                    alert('Data Saved Successfully.');
					clear();                    
                },
                error: function (xhr, status, error) {
                    alert('Error occurred while saving the data.\n\r');
                    
                }
            });
	
}


function GetTagDetails(tagno)
{
    var TagNo = tagno == "" ? "" : tagno;
	$("#loading").show();
    if(TagNo != "")
    {
        $.ajax({
			//url: 'http://localhost:51594/api/Operations/GetTagDetails/' + TagNo,
           url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/GetTagDetails/' + TagNo,

            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
					$("#hidVTId").val(result[0].VTId);
                    $("#txttruckno").val(result[0].TruckNo);
                    $("#txtOpCode").val(result[0].OperationCode);
                    $("#txtCStage").val(result[0].CurrentStageName);
					$("#txtOperation").val(result[0].Operation);
					$("#btnSubmit span").text(result[0].NextStageName);
					$("#hidNStageId").val(result[0].NextStageId);
					 VaalidateUserStage($("#hidNStageId").val());
                }
                else {
                    $("#lblMsg").text("No Data Found");
                    $("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#lblMsg").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                //$("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}

function GetTruckDetails(truckno)
{
    var TruckNo = truckno == "" ? "" : truckno;
	$("#loading").show();
    if(TruckNo != "")
    {
        $.ajax({
			//url: 'http://localhost:51594/api/Operations/GetTruckDetails/' + TruckNo,
           url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/GetTruckDetails/' + TruckNo,

            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
					$("#hidVTId").val(result[0].VTId);
                    $("#txttag").val(result[0].TagNo);
                    $("#txtOpCode").val(result[0].OperationCode);
                    $("#txtCStage").val(result[0].CurrentStageName);

					$("#txtOperation").val(result[0].Operation);
					$("#btnSubmit span").text(result[0].NextStageName);
					$("#hidNStageId").val(result[0].NextStageId);
					 VaalidateUserStage($("#hidNStageId").val());
                }
                else {
                    $("#lblMsg").text("No Data Found.");
                    //$("#txttruckno").val("");//clearing the Truck details in case of no data found for tag
                    $("#lblMsg").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                //$("#imgtruck").hide();
                
            }
        });
    }
	$("#loading").hide();
}



function VaalidateUserStage(stageid)
{
    var StageId = stageid == "" ? "" : stageid;
	$("#loading").show();
    if(StageId != "")
    {

        $.ajax({
		   url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/ValidateUserStage/' + $("#hidusrid").val() + '/' + StageId,
            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
					//alert(result[1]);
					if (result[1] == 'True') {
						$("#btnSubmit").attr('disabled',false);
						}
						else {
							$("#btnSubmit").attr('disabled',true);
						}
                }
                else {
                    $("#lblMsg").text("No Data Found");
                    //$("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#lblMsg").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Usare Stage details.');
                //$("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}

function clear()
{
	$("#btnSubmit span").text('Save');
	$("#btnSubmit").attr('disabled',true);
    //this.submit();
	txttag.value="";
	hidVTId.value="";
    txttruckno.value="";
    txtOpCode.value="";
    txtCStage.value="";
	txtOperation.value="";
	hidNStageId.value="";
	$("#lblMsg").text("");
	//alert(document.getElementById('hidDeviceId').value);
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

    if (parms.length > 0 && query != "") {
        $("#hidusrid").val(atob(qsParm["user"]));
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
$(document).ready(function () {
	qs();
	
	//alert($("#hidusrid").val());
	 showUserRecords();
		clear();
	
	$("#imgScanTag").click(function () {
		$("#lblMsg").text("");
        $("#loading").show();	
        scanTag();
        
        $("#loading").hide();
    });

    $("#imgScanTruckNo").click(function () {
        $("#loading").show();
         $("#lblMsg").text("");
        scanTruck();
        $("#loading").hide();
    });
	
	$("#imgSearch").click(function () {debugger;
		$("#loading").show();
        $("#lblMsg").text("");
		if ($("#txttruckno").val() == "") {
            alert('Please Enter Truck No.');             
            $("#txttruckno").focus();
            return false;
        }
		else GetTruckDetails($("#txttruckno").val());
       
        $("#loading").hide();
	});
	
	$("#btnSubmit").click(function () {
        $("#loading").show();
		$("#btnSubmit").attr('disabled',true);
		$("#btnClear").attr('disabled',true);
		$("#imgScanTag").attr('disabled',true);
		$("#imgScanTruckNo").attr('disabled',true);
        $("#lblMsg").text("");
		//alert('Save..');
		SaveOperationDetails();
		$("#imgScanTag").attr('disabled',false);
		$("#imgScanTruckNo").attr('disabled',false);
		$("#btnClear").attr('disabled',false);
        $("#loading").hide();
    });
	
	$("#btnClear").click(function() {
       clear();
        });
	
	$("#home").click(function () {
        $.ajax({
            type: "GET",
            url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),
	    //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });
	
	$("#Logout").click(function() {
			SaveAppAccessLog();
		});
	});
	
//  Internal (SQL Lite) DB Section-----Start--- 
	
		// --SQLLite Database Creation
		var db = openDatabase("LocalDB", "1.0", "Local Database", 200000);  // Open SQLLite Database
		function initDatabase()  // Function Call When Page is ready.
		{
			 try {
				 if (!window.openDatabase)  // Check browser is supported SQLLite or not.
				 {
					 alert('Databases are not supported in this browser.');
				 }
				 else {
					 //createUserTable();  // If supported then call Function for create table in SQLite
				 }
			 }
		 
			catch (e) {
				 if (e == 2) {
					 // Version number mismatch. 
					 console.log("Invalid database version.");
				 } else {
					 console.log("Unknown error " + e + ".");
				 }
				 return;
			 }
		 }
var user="";var pass="";		 
		 // Function For Retrive User data from Database
		var selectRecentUserStatement = " SELECT * FROM UserTbl where Id=(Select Max(Id) from UserTbl)";
		var userDataset;
		function showUserRecords() // Function For Retrive data from Database Display records as list
		{
			 db.transaction(function (tx) {
				 tx.executeSql(selectRecentUserStatement, [], function (tx, result) {
					 userDataset = result.rows;
					 if(userDataset.length==0)
					 {				 
						 //document.getElementById('lblmessage').innerHTML = 'Offline User Data Not Available.!';
						 //alert (' Offline User Data Not Available.!');	
					 }
					 else{
						 //document.getElementById('lblmessage').innerHTML = dataset.length+ ' Offline User Data Available.!';
						// alert (' Offline User Data Available.!');	
					 }
					 for (var i = 0, item = null; i < userDataset.length; i++) {
						item = userDataset.item(i);
						//alert('Id:'+item['Id']+ ', IMEI:'+item['IMEI']+', LoginId:'+item['LoginId']+', Password:'+item['Password']+', HomePage:'+item['HomePage']+',  CreatedTime:'+item['CreatedTime']);						 
						 user=item['LoginId'];
						 pass=item['Password'];
						 $("#hidimei").val(item['IMEI']);
						 //getSDS(item['LoginId'],item['Password']);
					 }
					 
				 });
			 });
		 }
//  Internal (SQL Lite) DB Section-----End--- 

function SaveAppAccessLog() // Function For Application Access Log detials
		{
			var Adddata = {};
            //Adddata.IMEI = '999';
            //Adddata.UUID = 'sss022';
			Adddata.IMEI = $("#hidimei").val();
            Adddata.UUID = $("#hiduuid").val();
            Adddata.AppAccessType = 'Out';
			//alert($("#hidimei").val());
			//alert($("#hiduuid").val());
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