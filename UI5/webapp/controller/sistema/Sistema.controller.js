sap.ui.define([
    "../BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.sistema.Sistema",{
        
        onInit: function(){
            var token =  localStorage.getItem("token");
            // if(!this.oRouter){
            //     this.oRouter = this.getRouter();
            // }
            if(!token){
                console.log("Usuario não logado");
                //var oRouter = this.getRouter();
                this.oRouter.navTo("login");     
            }
        },

        onBeforeRendering: function() {
            console.log("entrou no onAfterRendering");
            var token =  localStorage.getItem("token");
            var sistemasReturn = [];
            sap.ui.core.BusyIndicator.show(0);
            const url  = this.getURL("SistemaCompleto");
            if(token){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({}),
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        sistemasReturn = res.data;
                        sap.ui.core.BusyIndicator.hide(0);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                      sap.ui.core.BusyIndicator.hide(0);
                    }
                }).then(()=>{
                    var oData = {
                        sistemas:sistemasReturn
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel);
                    sap.ui.core.BusyIndicator.hide(0);
                    
                });
            }
            else{
                console.log("Usuario não logado");
                //var oRouter = this.getRouter();
                sap.ui.core.BusyIndicator.hide(0);
                this.oRouter.navTo("login");     
            }
        },

        onAdd: function(){
            
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    id: "formSistema",
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
        },

        onSave:function(){
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                
                //var oRouter = this.getRouter();
                this.oRouter.navTo("login");     
            }
            sap.ui.core.BusyIndicator.show(0);
            var fragmentId = this.getView().createId("formSistema");
            var oNmSistema = sap.ui.core.Fragment.byId(fragmentId, "nmSistema").getValue();
            var oControlarUsuario = sap.ui.core.Fragment.byId(fragmentId, "controlarUsuario").getSelected();
            var oTipoControle = sap.ui.core.Fragment.byId(fragmentId, "tipoControle").getSelectedButton().getText();
          
           

            const sistemaObj = {
                "nmSistema": oNmSistema,
                "status": true,
                "controlaUsuarios": oControlarUsuario
            }

            $.ajax({
                type: "PUT",
                url: `http://192.168.12.46:3347/InsertSistema`,
                data: JSON.stringify(sistemaObj),
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

    });
});