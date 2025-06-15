package com.school.health.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventory/")
public class InventoryController {


}
