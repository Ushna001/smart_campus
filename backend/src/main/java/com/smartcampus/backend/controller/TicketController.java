package com.smartcampus.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.backend.model.entity.Comment;
import com.smartcampus.backend.model.entity.Ticket;
import com.smartcampus.backend.model.entity.TicketAttachment;
import com.smartcampus.backend.model.enums.TicketStatus;
import com.smartcampus.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestPart("ticket") String ticketJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
        
        Ticket ticket = objectMapper.readValue(ticketJson, Ticket.class);
        return new ResponseEntity<>(ticketService.createTicket(ticket, files), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        TicketStatus status = TicketStatus.valueOf(body.get("status"));
        String resolutionNotes = body.get("resolutionNotes");
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, resolutionNotes));
    }

    // Comments Endpoints
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long id, 
            @RequestBody Comment comment) {
        return new ResponseEntity<>(ticketService.addComment(id, comment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getTicketComments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketComments(id));
    }
    
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<TicketAttachment>> getTicketAttachments(@PathVariable Long id) {
         return ResponseEntity.ok(ticketService.getTicketAttachments(id));
    }
}
