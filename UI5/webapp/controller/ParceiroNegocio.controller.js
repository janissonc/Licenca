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
            //this.oRouter = this.getRouter();
            if(!token){
                
                this.oRouter.navTo("login");     
            }
        },
        
        onBeforeRendering: function() {
            var token =  localStorage.getItem("token");
            
            var parceiroNegocioReturn = [];
            const url  = this.getURL("ParceiroNegocioCompleto");
            if(token){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({GroupCode:-1}),
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        console.log(res)
                        parceiroNegocioReturn = res.data;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                      console.log(jqXHR);
                        //   localStorage.setItem("token", null);
                        //   localStorage.setItem("dadosUser", null);
                      var oRouter = this.getRouter();
                      oRouter.navTo("login");
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