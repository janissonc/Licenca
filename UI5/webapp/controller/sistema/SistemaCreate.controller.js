sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.sistema.Detail", {
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
		},
		
        onCancel:function(){
            var oRouter = this.getOwnerComponent().getRouter();
			var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
			oRouter.navTo("sistema");
        },

		onSave:function(){
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
               	oRouter.navTo("login");     
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
          
            // $.ajax({
            //     type: "PUT",
            //     url: url,
            //     data: JSON.stringify(sistemaObj),
            //     //crossDomain: true,
            //     headers: {'Token':token},
            //     contentType: "application/json",
            //     success: function (res) {
            //         sap.ui.core.BusyIndicator.hide(0);
            //         MessageToast.show("Adicionado com sucesso")
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {
            //         console.log("Got an error response: " + textStatus + errorThrown);
            //         var response = jqXHR.responseJSON;
            //         sap.ui.core.BusyIndicator.hide(0);
            //         if(response.status == false && response.responseCode == 401){
            //             oRouter.navTo("login");
            //         }
            //     }
            // }).then(()=>{
            //     sap.ui.core.BusyIndicator.hide(0);
            // });
        },

	});
});
