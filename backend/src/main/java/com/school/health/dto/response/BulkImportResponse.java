package com.school.health.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkImportResponse {
    private int totalRecords;
    private int successCount;
    private int errorCount;
    private List<String> successUsers;
    private List<ImportError> errors;

    @Getter
    @Setter
    public static class ImportError {
        private int row;
        private String field;
        private String value;
        private String message;

        public ImportError(int row, String field, String value, String message) {
            this.row = row;
            this.field = field;
            this.value = value;
            this.message = message;
        }
    }
}
