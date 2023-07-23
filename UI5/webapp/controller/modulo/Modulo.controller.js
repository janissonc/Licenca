sap.ui.define([
    "../BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
    "sap/m/MessageBox"
],function(BaseController,MessageToast,JSONModel,Filter,FilterOperator,Sorter,MessageBox){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.modulo.Modulo",{
        
        onInit: function(){
            debugger
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }
            this._bDescendingSort = false;
            var oRouterFor = sap.ui.core.UIComponent.getRouterFor(this);

            // Registra o evento "routeMatched" para a rota "minhaRota"
            oRouterFor.getRoute("modulo").attachPatternMatched(this.onRotaEntrada, this);
        },
        
        onRotaEntrada: function(oEvent) {
            debugger
            const url  = this.getURL("SistemaCompleto");
            var token =  localStorage.getItem("token");
            var sistemasReturn = [];
            var oRouter = this.getRouter();
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
                        sistemasReturn = res.Data;
                        
                        sap.ui.core.BusyIndicator.hide(0);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        debugger
                      console.log("Got an error response: " + textStatus + errorThrown);
                      console.log(jqXHR.responseJSON);
                      sap.ui.core.BusyIndicator.hide(0);
                      let response = jqXHR.responseJSON;
                      if(response == undefined){
                        localStorage.removeItem("token");
                        localStorage.removeItem("dadosUser");
                        oRouter.navTo("login");
                      }

                      if(response.Status == false && response.ResponseCode == 401){
                        
                        localStorage.removeItem("token");
                        localStorage.removeItem("dadosUser");
                        oRouter.navTo("login");
                      }
                    }
                }).done(()=>{
                    var oData = {
                        listModulos:sistemasReturn
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel,"modulos");
                })
            }
            else{
                console.log("Usuario não logado");
                //var oRouter = this.getRouter();
                sap.ui.core.BusyIndicator.hide(0);
                this.oRouter.navTo("login");     
            }
        },

        onAdd: function(){
            
            var oRouter = this.getRouter();
            
            oRouter.navTo("sistemaCreate");  
        },

        onCancel:function(){
            this.pDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        onCancelEdit:function(){
            this.pDialogEdit.then(function(oDialog) {
                oDialog.close();
            });
        },

        onSave:function(){
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
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
                    var response = jqXHR.responseJSON;
                    sap.ui.core.BusyIndicator.hide(0);
                    if(response.status == false && response.responseCode == 401){
                        oRouter.navTo("login");
                    }
                }
            }).then(()=>{
                sap.ui.core.BusyIndicator.hide(0);
            });
        },

        handlerDelete:function(oEvent){
            
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
            var sObjectId =  oEvent.getSource().getBindingContext("sistemas").getObject();
            let url = "";
            if(sObjectId){
                url =  this.getURL(`DeleteSistema/?cdSistema=${sObjectId.cdSistema}`)
            }else{
                sap.ui.core.BusyIndicator.hide(0);
                MessageToast.show("Erro ao recuperar item para ser deletado")
            }

            MessageBox.warning("Deseja mesmo deletar esse dado? ", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if(sAction == "OK"){
                            sap.ui.core.BusyIndicator.show(0);
                            $.ajax({
                                type: "DELETE",
                                url: url,
                                data: JSON.stringify({}),
                                //crossDomain: true,
                                headers: {'Token':token},
                                contentType: "application/json",
                                success: function (res) {
                                    sap.ui.core.BusyIndicator.hide(0);
                                    console.log(this.getView().getModel("sistemas").getData())
                                    MessageToast.show("Deletado com sucesso")
                                    oRouter.navTo("sistema");
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log("Got an error response: " + textStatus + errorThrown);
                                    var response = jqXHR.responseJSON;
                                    sap.ui.core.BusyIndicator.hide(0);
                                    if(response.status == false && response.responseCode == 401){
                                        oRouter.navTo("login");
                                    }
                                }
                            }).then(()=>{
                                
                                sap.ui.core.BusyIndicator.hide(0);
                            });
                        }else{
                            sap.ui.core.BusyIndicator.hide(0);
                        }
                        
                    }
                });

           
        },

        onEdit:function(oEvent){
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
            var sObjectId =  oEvent.getSource().getBindingContext("sistemas").getObject();
            oRouter.navTo("sistemaEdit",{id:sObjectId.cdSistema}); 
        },

        onHandlerEdit:function(){
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }
            sap.ui.core.BusyIndicator.show(0);
            var fragmentId = this.getView().createId("formSistema");
            var oCdSistema = sap.ui.core.Fragment.byId(fragmentId, "cdSistema").getValue();
            var oNmSistema = sap.ui.core.Fragment.byId(fragmentId, "nmSistema").getValue();
            var oControlarUsuario = sap.ui.core.Fragment.byId(fragmentId, "controlarUsuario").getSelected();
            var oAtivo = sap.ui.core.Fragment.byId(fragmentId, "ativo").getState();
            var oTipoControle = sap.ui.core.Fragment.byId(fragmentId, "tipoControle").getSelectedButton().getText();
          
            const sistemaObj = {
                "cdSistema": oCdSistema,
                "nmSistema": oNmSistema,
                "status": oAtivo,
                "controlaUsuarios": oControlarUsuario
            }
           const url =  this.getURL("UpdateSistema")
           //var oRouter = this.getRouter();
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
                    var response = jqXHR.responseJSON;
                    sap.ui.core.BusyIndicator.hide(0);
                    if(response.status == false && response.responseCode == 401){
                        var oRouter = this.getRouter();
                        oRouter.navTo("login");
                    }
                }
            }).then(()=>{
                sap.ui.core.BusyIndicator.hide(0);
            });
        }

    });
});