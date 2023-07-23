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
    return BaseController.extend("sap.ui.demo.walkthrough.sistema.SistemaEdit",{
        
        onInit: function(){
            debugger
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();

            var oData = {
                sistema:{
                    cdSistema:0,
                    nmSistema:'',
                    status:false
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel,"sistemaEdit");
            if(!token){
                console.log("Usuario não logado");
                
                oRouter.navTo("login");     
            }
            oRouter.getRoute("sistemaEdit").attachPatternMatched( this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent) {
          var parametro = oEvent.getParameter("arguments").id;
          const url  = this.getURL("SistemaCompleto");
          var token =  localStorage.getItem("token");
          var sistemasReturn = [];
          var oRouter = this.getRouter();
          
          sap.ui.core.BusyIndicator.show(0);
          if(token){
              $.ajax({
                  type: "POST",
                  url: url,
                  data: JSON.stringify({cdSistema:parametro}),
                  //crossDomain: true,
                  headers: {'Token':token},
                  contentType: "application/json",
                  success: function (res) {
                      sistemasReturn = res.Data[0];
                      console.log(res.Data[0])
                      sap.ui.core.BusyIndicator.hide(0);
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                      debugger
                    console.log("Got an error response: " + textStatus + errorThrown);
                    console.log(jqXHR.responseJSON);
                    sap.ui.core.BusyIndicator.hide(0);
                    let response = jqXHR.responseJSON;
                    if(response.Status == false && response.ResponseCode == 401){
                      
                      localStorage.removeItem("token");
                      localStorage.removeItem("dadosUser");
                      oRouter.navTo("login");
                    }
                  }
              }).done(()=>{
                  var oData = {
                      sistema:sistemasReturn
                  };
                 
                  this.getView().getModel("sistemaEdit").setData(oData)
              })
          }
          else{
              console.log("Usuario não logado");
              //var oRouter = this.getRouter();
              sap.ui.core.BusyIndicator.hide(0);
              this.oRouter.navTo("login");     
          }
          
        },

        onCancelEdit:function(){
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
                
                oRouter.navTo("login");     
            }
            oRouter.navTo("sistema");
        },

        onHandlerEdit:function(){
            var token =  localStorage.getItem("token");
            var oRouter = this.getRouter();
            if(!token){
                console.log("Usuario não logado");
                oRouter.navTo("login");     
            }
            sap.ui.core.BusyIndicator.show(0);
            var sistemaEdit = this.getView().getModel("sistemaEdit").getData();
            const sistemaObj = {
                "cdSistema": sistemaEdit.sistema.cdSistema,
                "nmSistema": sistemaEdit.sistema.nmSistema,
                "status": sistemaEdit.sistema.status
            }
            console.log(this.getView().getModel("sistemaEdit").getData())
            console.log(sistemaObj)
            sap.ui.core.BusyIndicator.hide(0);
           
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
                    oRouter.navTo("sistema");
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