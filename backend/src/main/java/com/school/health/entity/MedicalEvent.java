package com.school.health.entity;



import com.school.health.enums.MedicalEventStatus;
import com.school.health.enums.SeverityLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "MedicalEvent")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EventId", nullable = false)
    private int id;

    //Tiêu đề sự cố
    @Column(name = "Title", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String title;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "medical_event_student", // tên bảng trung gian
            joinColumns = @JoinColumn(name = "EventId"), // khóa ngoại tới bảng này
            inverseJoinColumns = @JoinColumn(name = "StudentId") // khóa ngoại tới bảng đối diện

    )

    private List<Student> studentList = new ArrayList<>();


    // Loại sự kiện “Ngất xỉu”, “Chảy máu”, “Đau bụng”, “Gãy tay” v.v.
    @Column(name = "EventType", columnDefinition = "NVARCHAR(50)")
    private String eventType;

    //Học sinh bị lúc nào
    @Column(name = "EventDate", nullable = false)
    private LocalDateTime eventDate;

    // Địa điểm xảy ra "Cầu thang, lớp học, sân trường,....
    @Column(name = "Location", columnDefinition = "NVARCHAR(100)")
    private String location;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "CreatedBy", nullable = false)
    private User createdBy;


    @Column(name = "Notes", columnDefinition = "NVARCHAR(255)")
    private String notes;

  @OneToMany(mappedBy = "relatedEvent", cascade = CascadeType.MERGE)
    private List<InventoryUsedLog> relatedInventoryUsed = new ArrayList<>();

    //Phương án giải quyết (Sơ cứu tại trường, gọi phụ huynh, đưa đi bệnh viện,...)
    @Column(name = "HandlingMeasures", columnDefinition = "NVARCHAR(255)")
    private String handlingMeasures;

    //Mức độ (Nhẹ, Trung Bình, Nặng, Cấp cứu)
    @Enumerated(EnumType.STRING)
    @Column(name = "SeverityLevel", columnDefinition = "NVARCHAR(20)")
    private SeverityLevel severityLevel;

    // Trạng thái “Đang xử lý / Đã xử lý / Chờ xác nhận”
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", columnDefinition = "NVARCHAR(20)")
    private MedicalEventStatus status;

    public void addStudent(Student student) {
        studentList.add(student);
    }
    public void removeStudent(Student student) {
        studentList.remove(student);
    }
    public void addRelatedInventoryUsed(InventoryUsedLog inventoryUsedLog) {
        relatedInventoryUsed.add(inventoryUsedLog);
    }
}
