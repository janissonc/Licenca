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
            var teste = [];
            if(token){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.12.46:3347/ParceiroNegocioCompleto",
                    data: {GroupCode:-1},
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        teste = res;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                    }
                }).then(()=>{
                    var sRecipient = this.getModel().setProperty("/recipient/dados",teste);
                });
            }
           
        },

    });
});