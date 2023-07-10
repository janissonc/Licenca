sap.ui.define([
    "../BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.sistema.Sistema",{
        
        onInit: function(){
            console.log("entrou no init");
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }

            var teste = [];
            sap.ui.core.BusyIndicator.show(0);
            if(token){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.12.46:3347/SistemaCompleto",
                    data: JSON.stringify({}),
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        teste = res;
                        sap.ui.core.BusyIndicator.hide(0);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                      sap.ui.core.BusyIndicator.hide(0);
                    }
                }).then(()=>{
                    var oData = {
                        recipient:{
                            name: "UI5",
                            dados:teste
                        },
                        
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel);
                    sap.ui.core.BusyIndicator.hide(0);
                });
            }
            else{
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                sap.ui.core.BusyIndicator.hide(0);
                oRouter.navTo("login");   

            }

            
            
        },

        onAfterRendering: function() {
            console.log("entrou no onAfterRendering");
            var token =  localStorage.getItem("token");
            var teste = [];
            sap.ui.core.BusyIndicator.show(0);
            if(token){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.12.46:3347/SistemaCompleto",
                    data: JSON.stringify({}),
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        teste = res.data;
                        sap.ui.core.BusyIndicator.hide(0);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                      sap.ui.core.BusyIndicator.hide(0);
                    }
                }).then(()=>{
                    var oData = {
                        recipient:{
                            name: "UI5",
                            dados:teste
                        },
                        
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel);
                    sap.ui.core.BusyIndicator.hide(0);
                    
                });
            }
            else{
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                sap.ui.core.BusyIndicator.hide(0);
                oRouter.navTo("login");     
            }
        },

        onAdd: function(){
            
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "sap.ui.demo.walkthrough.view.sistema.SistemaCreate"
                });
            } 

            this.pDialog.then(function(oDialog) {
                oDialog.open();
            });
        },

        onCancel:function(){
            this.pDialog.then(function(oDialog) {
                oDialog.close();
            });
        }

    });
});