# MemeGag Architecture Documentation

## Overview

MemeGag is a production-grade, globally scalable social entertainment platform built with a modern microservices architecture. This document outlines the complete system design, components, and interactions.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────┬──────────────────────────────────────┬─────────┤
│  Web (Next.js)  │  Mobile (React Native)  │ Admin Panel │
└────────┬────────┴────────┬─────────────────┴────────┬──┘
         │                 │                          │
         └─────────────────┼──────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ CloudFront  │
                    │    (CDN)    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼──────────────────────┐
         │                 │                      │
    ┌────▼────┐    ┌──────▼──────┐    ┌─────────▼──┐
    │ API     │    │ WebSocket   │    │ Media      │
    │ Gateway │    │ Service     │    │ Service    │
    │ (NestJS)│    │ (Socket.IO) │    │ (FFmpeg)   │
    └────┬────┘    └──────┬──────┘    └─────────┬──┘
         │                │                     │
         └────────────────┼─────────────────────┘
                          │
         ┌────────────────┼──────────────────────────┬──────────────┐
         │                │                          │              │
    ┌────▼─────┐  ┌──────▼──────┐   ┌─────────┐  ┌──▼────────┐  ┌─▼────────┐
    │ Feed     │  │ Auth        │   │ AI      │  │ Search   │  │Search    │
    │ Service  │  │ Service     │   │ Service │  │ Service  │  │Engine    │
    └────┬─────┘  └──────┬──────┘   └────┬────┘  └──┬───────┘  └──┬───────┘
         │                │                │          │            │
         └────────────────┼────────────────┼──────────┼────────────┘
                          │                │
                  ┌───────▼────────────────▼────┐
                  │    PostgreSQL Database     │
                  │  (Primary Data Store)      │
                  └───────┬────────────────────┘
                          │
         ┌────────────────┼─────────────────────┐
         │                │                     │
    ┌────▼────┐    ┌─────▼──────┐    ┌────────▼──┐
    │ Redis   │    │ Elasticsearch    │ Kafka    │
    │ Cache   │    │ Search Index     │ Events   │
    └─────────┘    └──────────────────┘────────┬─┘
                                                │
                            ┌───────────────────▼────┐
                            │ Event-Driven Services  │
                            │ - Moderation           │
                            │ - Notifications        │
                            │ - Analytics            │
                            │ - Recommendations      │
                            └────────────────────────┘
```

## Core Services

### 1. API Gateway (NestJS)
- **Purpose**: Single entry point for all API requests
- **Responsibilities**:
  - Request routing to appropriate microservices
  - Authentication and authorization
  - Rate limiting
  - Request validation
  - Response serialization
  - CORS handling
  - GraphQL Federation gateway

**Key Endpoints**:
- `/auth/*` - Authentication
- `/posts/*` - Post management
- `/comments/*` - Comments
- `/users/*` - User profiles
- `/communities/*` - Communities
- `/feed/*` - Feed generation
- `/search/*` - Search queries
- `/notifications/*` - Notifications
- `/livestreams/*` - Livestreams

### 2. Feed Service
- **Purpose**: Generate personalized feeds
- **Responsibilities**:
  - Candidate generation from different sources
  - Ranking using ML models
  - Personalization based on user behavior
  - Feed caching
  - Trending content detection

**Key Features**:
- For You (personalized)
- Following (subscribed users)
- Trending (trending posts)
- Hot (viral posts)
- Fresh (latest posts)
- Community-specific feeds
- Regional feeds

### 3. AI Services
- **Purpose**: Multimodal AI processing
- **Responsibilities**:
  - Meme generation (text-to-image)
  - Caption generation
  - Image classification and tagging
  - Video processing and analysis
  - Duplicate detection
  - Virality prediction
  - Sentiment analysis

**AI Models**:
- OpenAI DALL-E 3 for image generation
- OpenAI GPT-4V for image understanding
- Anthropic Claude for text generation
- Local models for latency-sensitive tasks

### 4. Moderation Service
- **Purpose**: Content safety and abuse prevention
- **Responsibilities**:
  - Toxicity detection
  - Hate speech detection
  - NSFW content detection
  - Spam detection
  - Bot detection
  - Misinformation detection
  - Brigading detection
  - Manual review workflows

**Detection Methods**:
- AI-based toxicity scoring
- OCR for text in images
- Behavioral analysis for bot detection
- Cross-platform tracking for brigading

### 5. Search Service (Elasticsearch)
- **Purpose**: Full-text and semantic search
- **Responsibilities**:
  - Indexing posts and content
  - Full-text search with fuzzy matching
  - Semantic search with embeddings
  - Filter aggregations
  - Real-time index updates

**Index Types**:
- Posts index (text, tags, descriptions)
- Users index (usernames, display names)
- Comments index (threaded comments)
- Hashtags index (trending topics)

### 6. Notification Service
- **Purpose**: Multi-channel notifications
- **Responsibilities**:
  - Push notifications
  - Email notifications
  - Webhook notifications
  - Notification batching
  - Preference management
  - Delivery tracking

**Channels**:
- Firebase Cloud Messaging
- Apple Push Notification service
- Email (Resend/SendGrid)
- SMS (Twilio)
- WebSocket (real-time in-app)

### 7. Real-time Service (WebSocket)
- **Purpose**: Real-time communication
- **Responsibilities**:
  - WebSocket connection management
  - Presence tracking
  - Real-time comment streams
  - Typing indicators
  - Message broadcasting
  - Session management

**Technology**: Socket.IO with Redis adapter for horizontal scaling

### 8. Recommendation Service
- **Purpose**: Personalization engine
- **Responsibilities**:
  - User embeddings
  - Collaborative filtering
  - Content-based recommendations
  - Trend prediction
  - Feature store management
  - A/B testing framework

### 9. Analytics Service
- **Purpose**: Event tracking and analysis
- **Responsibilities**:
  - Event ingestion
  - User analytics
  - Post performance tracking
  - Engagement metrics
  - Cohort analysis
  - Dashboard generation

**Data Pipeline**:
- Kafka → Event Processor → ClickHouse
- Real-time dashboards with Grafana

### 10. Livestream Service
- **Purpose**: Live video streaming
- **Responsibilities**:
  - RTMP ingest
  - HLS stream generation
  - Adaptive bitrate streaming
  - Stream recording
  - Viewer management
  - Real-time chat integration

**Video Processing**:
- FFmpeg for transcoding
- AWS MediaConvert for distributed processing
- CloudFront for HLS delivery

### 11. Creator Service
- **Purpose**: Creator economy features
- **Responsibilities**:
  - Creator analytics
  - Revenue tracking
  - Tipping and subscriptions
  - Product storefront
  - Payout management
  - Tax information handling

### 12. Media Service
- **Purpose**: Media upload and processing
- **Responsibilities**:
  - Image optimization
  - Video transcoding
  - GIF conversion
  - Thumbnail generation
  - CDN distribution
  - Cleanup and lifecycle management

## Data Flow Architecture

### Content Upload Flow
```
User Upload
    ↓
API Gateway (validation)
    ↓
Media Service (processing)
    ↓
S3 Storage + CloudFront
    ↓
Moderation Service (async)
    ↓
Search Index Update (async)
    ↓
Post Published Event (Kafka)
    ↓
Feed Index Update
Analytics Event
Notification (if mentioned)
```

### Feed Generation Flow
```
User Request
    ↓
Feed Service (candidate generation)
    ↓
Multiple Sources:
  - Recently published posts
  - Trending posts
  - Following content
  - Recommendations
    ↓
Ranking Pipeline:
  - Engagement prediction
  - Relevance scoring
  - Personalization
  - Diversity adjustment
    ↓
Caching (Redis)
    ↓
Response to Client
```

### Moderation Flow
```
Content Published
    ↓
AI Moderation (async)
    ↓
Toxicity Score
    ↓
Decision Logic:
  - Score > 0.9 → AUTO REMOVE
  - 0.5-0.9 → HUMAN REVIEW
  - < 0.5 → PUBLISH
    ↓
Moderation Report (Kafka Event)
    ↓
Admin Dashboard Update
Creator Notification
Analytics Update
```

## Technology Stack Deep Dive

### Frontend Layer
- **Next.js 15** with App Router
- **React Server Components** for performance
- **TanStack Query** for server state
- **Zustand** for client state
- **TailwindCSS** + **shadcn/ui** for styling

### Backend Layer
- **NestJS** framework with TypeScript
- **Prisma ORM** for type-safe database access
- **GraphQL Federation** for API composition
- **gRPC** for inter-service communication
- **Redis Streams** for event queuing

### Data Layer
- **PostgreSQL** as primary database
- **Redis** for caching and sessions
- **Elasticsearch** for search
- **ClickHouse** for analytics
- **S3** for media storage

### Message Queue & Events
- **Kafka** for event streaming
- **BullMQ** for job scheduling
- **Redis Streams** for simple async tasks

### Infrastructure
- **Docker** for containerization
- **Kubernetes** for orchestration
- **Terraform** for infrastructure as code
- **GitOps** for deployment automation

### Monitoring & Observability
- **OpenTelemetry** for distributed tracing
- **Prometheus** for metrics
- **Grafana** for dashboards
- **Sentry** for error tracking
- **ELK Stack** for centralized logging

## Deployment Architecture

### Multi-Region Strategy
- **Primary Region**: US-East-1 (main workload)
- **Secondary Regions**: EU-West-1, APAC (replicas)
- **Cross-region replication** for PostgreSQL
- **Global CDN** via CloudFront

### Kubernetes Topology
```
┌─────────────────────────────────────────────────────┐
│           Kubernetes Cluster                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐ ┌────────────┐ │
│  │   API-GW    │  │  Feed Svc    │ │  AI Svc   │ │
│  │  (3 replicas)│  │  (2 replicas)│ │(2 replicas)│ │
│  └──────────────┘  └──────────────┘ └────────────┘ │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐ ┌────────────┐ │
│  │  Moderation  │  │   Search     │ │ WebSocket │ │
│  │  (2 replicas)│  │(2 replicas)  │ │(3 replicas)│ │
│  └──────────────┘  └──────────────┘ └────────────┘ │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐ ┌────────────┐ │
│  │ Notification │  │ Livestream   │ │ Analytics │ │
│  │ (2 replicas) │  │(2 replicas)  │ │(1 replica) │ │
│  └──────────────┘  └──────────────┘ └────────────┘ │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Data Layer                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  StatefulSets:                               │   │
│  │  - PostgreSQL (primary + replicas)           │   │
│  │  - Redis (cluster)                           │   │
│  │  - Elasticsearch (cluster)                   │   │
│  │  - Kafka (3 brokers)                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Auto-Scaling Strategy
- **API Gateway**: Scale 2-10 based on RPS
- **Feed Service**: Scale 2-5 based on CPU
- **Moderation**: Scale 2-4 based on queue depth
- **Search**: Scale 2-3 based on query latency
- **WebSocket**: Scale 3-8 based on concurrent connections

## Performance Characteristics

### Target Metrics
- **P95 API Latency**: < 200ms
- **P99 API Latency**: < 500ms
- **Feed Load Time**: < 500ms
- **Search Query**: < 100ms
- **WebSocket Latency**: < 50ms

### Caching Strategy
- **CDN Cache**: 1 hour for media
- **Redis Cache**: 5-60 min for dynamic content
- **Browser Cache**: 24h for static assets
- **Query Cache**: 5 min for feed results

## Security Architecture

### Authentication
- OAuth 2.0 for social login (Google, Discord, Apple, Reddit)
- JWT for API authentication
- Refresh tokens for long-lived sessions
- MFA support with WebAuthn

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Community moderator roles
- Admin dashboard access control

### Data Protection
- TLS 1.3 for all transport
- Encryption at rest for sensitive data
- Database encryption
- PII masking in logs

### Attack Prevention
- Rate limiting (100 req/15min per IP)
- DDoS protection via CloudFront
- CSRF tokens for state-changing operations
- XSS prevention via Content Security Policy
- SQL injection prevention via ORM
- Input validation on all endpoints

## Disaster Recovery

### Backup Strategy
- **PostgreSQL**: Continuous replication + daily snapshots
- **S3**: Cross-region replication
- **Redis**: AOF persistence + snapshots
- **RPO**: < 15 minutes
- **RTO**: < 1 hour

### Failover Procedures
1. Automated detection of service failures
2. Graceful shutdown of unhealthy instances
3. Automatic rerouting to healthy replicas
4. DNS failover for regional disasters
5. Manual recovery procedures documented in runbooks

## Monitoring & Alerting

### Key Metrics
- API response time (p50, p95, p99)
- Error rate by service
- Database connection pool usage
- Cache hit rates
- Queue depths
- WebSocket connection count
- Stream bitrate and quality

### Alert Thresholds
- API P95 > 500ms
- Error rate > 1%
- Pod restart > 3 in 10min
- Database CPU > 80%
- Disk usage > 90%
- Queue depth > 10k

---

For detailed information on specific components, see:
- [Database Schema Documentation](./DATABASE.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
