package fantasyleague.web.rest;

import fantasyleague.Application;
import fantasyleague.domain.ChatMessage;
import fantasyleague.repository.ChatMessageRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the ChatMessageResource REST controller.
 *
 * @see ChatMessageResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class ChatMessageResourceTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    private static final String DEFAULT_CONTENT = "SAMPLE_TEXT";
    private static final String UPDATED_CONTENT = "UPDATED_TEXT";

    private static final DateTime DEFAULT_DATE = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_DATE = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_DATE_STR = dateTimeFormatter.print(DEFAULT_DATE);

    @Inject
    private ChatMessageRepository chatMessageRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restChatMessageMockMvc;

    private ChatMessage chatMessage;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ChatMessageResource chatMessageResource = new ChatMessageResource();
        ReflectionTestUtils.setField(chatMessageResource, "chatMessageRepository", chatMessageRepository);
        this.restChatMessageMockMvc = MockMvcBuilders.standaloneSetup(chatMessageResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        chatMessage = new ChatMessage();
        chatMessage.setContent(DEFAULT_CONTENT);
        chatMessage.setDate(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createChatMessage() throws Exception {
        int databaseSizeBeforeCreate = chatMessageRepository.findAll().size();

        // Create the ChatMessage

        restChatMessageMockMvc.perform(post("/api/chatMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(chatMessage)))
                .andExpect(status().isCreated());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();
        assertThat(chatMessages).hasSize(databaseSizeBeforeCreate + 1);
        ChatMessage testChatMessage = chatMessages.get(chatMessages.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testChatMessage.getDate().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void getAllChatMessages() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        // Get all the chatMessages
        restChatMessageMockMvc.perform(get("/api/chatMessages"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(chatMessage.getId().intValue())))
                .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
                .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE_STR)));
    }

    @Test
    @Transactional
    public void getChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        // Get the chatMessage
        restChatMessageMockMvc.perform(get("/api/chatMessages/{id}", chatMessage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(chatMessage.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE_STR));
    }

    @Test
    @Transactional
    public void getNonExistingChatMessage() throws Exception {
        // Get the chatMessage
        restChatMessageMockMvc.perform(get("/api/chatMessages/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

		int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();

        // Update the chatMessage
        chatMessage.setContent(UPDATED_CONTENT);
        chatMessage.setDate(UPDATED_DATE);
        

        restChatMessageMockMvc.perform(put("/api/chatMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(chatMessage)))
                .andExpect(status().isOk());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();
        assertThat(chatMessages).hasSize(databaseSizeBeforeUpdate);
        ChatMessage testChatMessage = chatMessages.get(chatMessages.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testChatMessage.getDate().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void deleteChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

		int databaseSizeBeforeDelete = chatMessageRepository.findAll().size();

        // Get the chatMessage
        restChatMessageMockMvc.perform(delete("/api/chatMessages/{id}", chatMessage.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();
        assertThat(chatMessages).hasSize(databaseSizeBeforeDelete - 1);
    }
}
