package com.renhy.server.taiko.common;

import lombok.Data;

@Data
public class Response {

    private boolean isSuccess;
    private Object data;
    private String errorMsg;

    public static Response success(Object data) {
        Response response = new Response();
        response.setSuccess(true);
        response.setData(data);
        return response;
    }

    public static Response failure(String errorMsg) {
        Response response = new Response();
        response.setSuccess(false);
        response.setErrorMsg(errorMsg);
        return response;
    }

}
