sap.ui.define([
    "../BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,MessageBox,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.sistema.Sistema",{
        
        onInit: function(){
            var token =  localStorage.getItem("token");
            // if(!this.oRouter){
            //     this.oRouter = this.getRouter();
            // }
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }
        },

        onBeforeRendering: function() {
            const url  = this.getURL("SistemaCompleto");
            var token =  localStorage.getItem("token");
            var sistemasReturn = [];
            sap.ui.core.BusyIndicator.show(0);
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
           const url =  this.getURL("InsertSistema")
          
            $.ajax({
                type: "PUT",
                url: url,
                data: JSON.stringify(sistemaObj),
                //crossDomain: true,
                headers: {'Token':token},
                contentType: "application/json",
                success: function (res) {
                    sap.ui.core.BusyIndicator.hide(0);
                    MessageToast.show("Adicionado com sucesso")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log("Got an error response: " + textStatus + errorThrown);
                  sap.ui.core.BusyIndicator.hide(0);
                }
            }).then(()=>{
                sap.ui.core.BusyIndicator.hide(0);
            });
        },

        handlerDelete:function(oEvent){
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                
                //var oRouter = this.getRouter();
                this.oRouter.navTo("login");     
            }
            var sObjectId =  oEvent.getSource().getBindingContext().getObject();
            let url = "";
            console.log("delete",sObjectId.cdSistema)
            if(sObjectId){
                url =  this.getURL(`DeleteSistema/?cdSistema=${sObjectId.cdSistema}`)
            }

            MessageBox.warning("Deseja mesmo deletar esse dado? ", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if(sAction == "OK"){
                            $.ajax({
                                type: "DELETE",
                                url: url,
                                data: JSON.stringify({}),
                                //crossDomain: true,
                                headers: {'Token':token},
                                contentType: "application/json",
                                success: function (res) {
                                    sap.ui.core.BusyIndicator.hide(0);
                                    MessageToast.show("Deletado com sucesso")
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                console.log("Got an error response: " + textStatus + errorThrown);
                                sap.ui.core.BusyIndicator.hide(0);
                                }
                            }).then(()=>{
                                
                                sap.ui.core.BusyIndicator.hide(0);
                            });
                        }
                        
                    }
                });

           
        },

        onEdit:function(oEvent){
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                
                //var oRouter = this.getRouter();
                this.oRouter.navTo("login");     
            }
            var sObjectId =  oEvent.getSource().getBindingContext().getObject();
            var oData = {
                sistema:sObjectId
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    id: "formSistema",
                    name: "sap.ui.demo.walkthrough.view.sistema.SistemaEdit"
                });
            } 

            this.pDialog.then(function(oDialog) {
                oDialog.open();
            });
        },

        onHandlerEdit:function(){
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                
                //var oRouter = this.getRouter();
                this.oRouter.navTo("login");     
            }
            sap.ui.core.BusyIndicator.show(0);
            var fragmentId = this.getView().createId("formSistema");
            var oCdSistema = sap.ui.core.Fragment.byId(fragmentId, "cdSistema").getValue();
            var oNmSistema = sap.ui.core.Fragment.byId(fragmentId, "nmSistema").getValue();
            var oControlarUsuario = sap.ui.core.Fragment.byId(fragmentId, "controlarUsuario").getSelected();
            var oTipoControle = sap.ui.core.Fragment.byId(fragmentId, "tipoControle").getSelectedButton().getText();
          
           

            const sistemaObj = {
                "cdSistema": oCdSistema,
                "nmSistema": oNmSistema,
                "status": true,
                "controlaUsuarios": oControlarUsuario
            }
           const url =  this.getURL("UpdateSistema")
          
            $.ajax({
                type: "PATCH",
                url: url,
                data: JSON.stringify(sistemaObj),
                //crossDomain: true,
                headers: {'Token':token},
                contentType: "application/json",
                success: function (res) {
                    sap.ui.core.BusyIndicator.hide(0);
                    MessageToast.show("Alterado com sucesso")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log("Got an error response: " + textStatus + errorThrown);
                  sap.ui.core.BusyIndicator.hide(0);
                }
            }).then(()=>{
                sap.ui.core.BusyIndicator.hide(0);
            });
        }

    });
});