package com.smartcampus.backend.service;

import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.model.entity.Comment;
import com.smartcampus.backend.model.entity.Ticket;
import com.smartcampus.backend.model.entity.TicketAttachment;
import com.smartcampus.backend.model.enums.TicketStatus;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketAttachmentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    public Ticket createTicket(Ticket ticket, MultipartFile[] files) {
        ticket.setStatus(TicketStatus.OPEN);
        Ticket savedTicket = ticketRepository.save(ticket);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileUrl = fileStorageService.storeFile(file);
                    TicketAttachment attachment = TicketAttachment.builder()
                            .ticket(savedTicket)
                            .imageUrl(fileUrl)
                            .build();
                    ticketAttachmentRepository.save(attachment);
                }
            }
        }

        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getUserTickets(Long userId) {
        return ticketRepository.findByCreatorId(userId);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    public Ticket updateTicketStatus(Long id, TicketStatus status, String resolutionNotes) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        if (resolutionNotes != null && !resolutionNotes.isEmpty()) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        
        Ticket updated = ticketRepository.save(ticket);
        
        notificationService.createNotification(
                updated.getCreator(),
                "Your ticket (ID: " + updated.getId() + ") status has changed to " + status.name()
        );

        return updated;
    }

    public Comment addComment(Long ticketId, Comment comment) {
        Ticket ticket = getTicketById(ticketId);
        comment.setTicket(ticket);
        Comment savedComment = commentRepository.save(comment);

        // Notify Ticket Creator if the comment is from someone else
        if (!ticket.getCreator().getId().equals(comment.getUser().getId())) {
             notificationService.createNotification(
                     ticket.getCreator(),
                     "A new comment was added to your ticket (ID: " + ticket.getId() + ")."
             );
        }
        
        return savedComment;
    }

    public List<Comment> getTicketComments(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }
    
    public List<TicketAttachment> getTicketAttachments(Long ticketId) {
        return ticketAttachmentRepository.findByTicketId(ticketId);
    }
}
