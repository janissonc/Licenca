sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/library",
	"sap/ui/core/mvc/XMLView"
], function (Device, Controller, JSONModel, Popover, Button,MessageBox, library,XMLView) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.App",{
       
        onInit: function () {
			debugger
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getOwnerComponent().getRouter();;
                oRouter.navTo("login");     
            }
		},
    });
});