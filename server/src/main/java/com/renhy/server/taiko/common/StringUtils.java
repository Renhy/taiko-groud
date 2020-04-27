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

    public static String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder("");
        if (bytes == null || bytes.length <= 0) {
            return "";
        }

        for (byte b : bytes) {
            int value = b & 0xFF;
            String str = Integer.toHexString(value);
            if (str.length() < 2) {
                sb.append(0);
            }
            sb.append(str);
        }
        return sb.toString();
    }


}
