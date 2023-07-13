sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.ParceiroNegocio",{
        
        onInit: function(){
            
            var token =  localStorage.getItem("token");
            
            if(!token){
                var oRouter = this.getRouter();
                oRouter.navTo("login");      
            }
        },
        
        onAfterRendering: function() {
            debugger
            var token =  localStorage.getItem("token");
            
            var parceiroNegocioReturn = [];
            const url  = this.getURL("ParceiroNegocioCompleto");
            //var oRouter = this.getRouter();
            if(token){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({groupCode:-1}),
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        console.log(res)
                        parceiroNegocioReturn = res.Data;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                      var response = jqXHR.responseJSON;
                      if(response.status == false && response.responseCode == 401){
                        oRouter.navTo("login");
                      }
                      
                      
                    }
                }).then(()=>{
                    var oData = {
                        parceiroNegocio:parceiroNegocioReturn
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel);
                    
                });
            }
            else{
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }
        },

    });
});