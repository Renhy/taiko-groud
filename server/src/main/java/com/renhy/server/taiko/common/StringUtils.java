package com.renhy.server.taiko.common;

public class StringUtils {


    public static String getSuffix(String fileName) {
        int index = fileName.lastIndexOf(".");

        if (index <= 0) {
            return null;
        }

        if (index >= fileName.length() - 1) {
            return null;
        }

        return fileName.substring(index + 1);
    }

    public static String clipSuffix(String fileName) {
        if (fileName.contains("/")) {
            fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
        }
        if (fileName.contains(".")) {
            return fileName.substring(0, fileName.indexOf("."));
        }

        return null;
    }




}
