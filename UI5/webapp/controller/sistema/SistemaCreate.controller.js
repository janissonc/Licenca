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
    return BaseController.extend("sap.ui.demo.walkthrough.sistema.SistemaCreate",{
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
            var oData = {
                sistema:{
                    nmSistema:'',
                    status:true
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel,"sistemaCreate");
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
            var oRouter = this.getOwnerComponent().getRouter();
            if(!token){
                console.log("Usuario não logado");
               	oRouter.navTo("login");     
            }
            sap.ui.core.BusyIndicator.show(0);
            
            var sistemaCreate = this.getView().getModel("sistemaCreate").getData();
            const sistemaObj = {
                "nmSistema": sistemaCreate.sistema.nmSistema,
                "status": sistemaCreate.sistema.status
            }
            console.log(this.getView().getModel("sistemaCreate").getData())
            console.log(sistemaObj)
           const url =  this.getURL("InsertSistema")
           sap.ui.core.BusyIndicator.hide(0);
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
                    console.log("response",res)
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
        },

	});
});
