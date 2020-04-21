package com.renhy.server.taiko.config;


import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.common.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@ControllerAdvice
public class GrobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(BusException.class)
    public Response handleBusException(
            HttpServletRequest request, HttpServletResponse response, BusException ex) {
        return Response.failure(ex.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(Exception.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public Response handleException(HttpServletRequest request, Exception ex) {
        log.error(request.getRequestURI(), ex);
        return Response.failure("服务异常");
    }


}
