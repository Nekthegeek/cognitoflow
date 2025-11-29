# CognitoFlow

**Intelligent Workflow Automation Platform**

CognitoFlow is a comprehensive workflow automation platform designed for financial operations, marketing campaigns, content generation, and business process automation. Build, monitor, and optimize automated workflows with real-time insights and intelligent recommendations.

---

## 🚀 Features

### Core Capabilities
- **Visual Workflow Builder**: Drag-and-drop interface for creating complex automation flows
- **Real-time Monitoring**: Live dashboard with performance metrics and health indicators
- **Smart Insights**: AI-powered recommendations for optimization, cost savings, and compliance
- **Multi-Integration Support**: Connect with 100+ services including Xero, SendGrid, Slack, and more
- **Advanced Analytics**: Detailed execution logs, performance tracking, and trend analysis

### Key Workflows
- 📊 **Financial Reporting**: Automated quarterly reports with PDF generation
- 🔍 **Competitor Analysis**: Web scraping and SWOT analysis pipelines
- ✍️ **Content Generation**: SEO-optimized blog posts with keyword trending
- 📧 **Email Campaigns**: Personalized email automation with scheduling
- 🎫 **Support Automation**: Intelligent ticket routing and response drafting

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+ (for caching and job queues)
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/cognitoflow.git
cd cognitoflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize the database
npm run db:migrate

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to access the CognitoFlow dashboard.

---

## 💾 Installation

### Local Development

```bash
# Install dependencies
npm install

# Set up the database
createdb cognitoflow_dev
npm run db:migrate
npm run db:seed  # Optional: populate with sample data

# Start services
npm run dev           # Frontend + API server
npm run worker        # Background job processor
npm run redis         # Start Redis (if not running)
```

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec api npm run db:migrate

# View logs
docker-compose logs -f
```

### Production Installation

See [Deployment Guide](./docs/deployment.md) for detailed production setup instructions.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cognitoflow_dev

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key-change-in-production
SESSION_SECRET=your-session-secret

# API Keys (for integrations)
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret
SENDGRID_API_KEY=your-sendgrid-key
OPENAI_API_KEY=your-openai-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Workspace Configuration

Configure your workspace settings in `config/workspace.yml`:

```yaml
workspace:
  name: "Main Workspace"
  description: "Financial Strategy Hub"
  timezone: "America/New_York"
  
  limits:
    max_flows: 50
    max_runs_per_day: 1000
    max_cost_per_day: 100.00
    
  notifications:
    email: admin@example.com
    slack_webhook: https://hooks.slack.com/...
    
  features:
    smart_insights: true
    auto_optimization: true
    compliance_checks: true
```

---

## 📘 Usage

### Creating Your First Flow

1. **Navigate to Dashboard**: Click "New Flow" button
2. **Choose Template**: Select from pre-built templates or start from scratch
3. **Configure Nodes**: Add and connect workflow nodes
4. **Set Triggers**: Define when the workflow should run
5. **Test & Deploy**: Run test execution before activating

### Example: Financial Report Workflow

```javascript
// config/flows/quarterly-report.json
{
  "name": "Quarterly Financial Report",
  "trigger": {
    "type": "schedule",
    "cron": "0 9 1 */3 *"  // 9 AM on first day of quarter
  },
  "nodes": [
    {
      "id": "fetch_data",
      "type": "xero.getData",
      "config": {
        "endpoint": "reports/profit-loss",
        "period": "QUARTER"
      }
    },
    {
      "id": "generate_pdf",
      "type": "pdf.generate",
      "input": "{{ fetch_data.output }}",
      "template": "quarterly-report.hbs"
    },
    {
      "id": "send_email",
      "type": "sendgrid.send",
      "config": {
        "to": "executives@company.com",
        "subject": "Q{{ quarter }} Financial Report",
        "attachments": ["{{ generate_pdf.output }}"]
      }
    }
  ]
}
```

### CLI Commands

```bash
# Flow management
npm run flow:create <name>          # Create new flow
npm run flow:list                   # List all flows
npm run flow:run <flow-id>          # Execute flow manually
npm run flow:pause <flow-id>        # Pause a flow
npm run flow:resume <flow-id>       # Resume a flow

# Monitoring
npm run monitor:health              # Check system health
npm run monitor:logs <flow-id>      # View flow execution logs
npm run monitor:metrics             # Display current metrics

# Utilities
npm run db:backup                   # Backup database
npm run db:restore <backup-file>    # Restore from backup
npm run cache:clear                 # Clear Redis cache
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + TypeScript + TailwindCSS + Recharts               │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API / WebSocket
┌─────────────────────┴───────────────────────────────────────┐
│                      API Server                             │
│  Node.js + Express + Authentication + Rate Limiting         │
└─────────┬───────────────────────────────┬───────────────────┘
          │                               │
┌─────────┴──────────┐         ┌─────────┴──────────┐
│   PostgreSQL       │         │   Redis            │
│   - Workflows      │         │   - Cache          │
│   - Executions     │         │   - Job Queue      │
│   - Users          │         │   - Sessions       │
└────────────────────┘         └────────────────────┘
          │
┌─────────┴──────────┐
│  Background Workers│
│  - Flow Executor   │
│  - Scheduler       │
│  - Webhooks        │
└────────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- TailwindCSS for styling
- Recharts for data visualization
- React Query for data fetching
- Zustand for state management

**Backend:**
- Node.js with Express
- PostgreSQL with Prisma ORM
- Bull for job queues
- Redis for caching
- JWT authentication

**Infrastructure:**
- Docker & Docker Compose
- Nginx reverse proxy
- PM2 for process management
- GitHub Actions for CI/CD

---

## 📚 API Reference

### Authentication

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "usr_123", "email": "user@example.com" }
}
```

### Flows

```bash
# List all flows
GET /api/flows
Authorization: Bearer <token>

# Get flow details
GET /api/flows/:flowId

# Create flow
POST /api/flows
Content-Type: application/json

{
  "name": "New Workflow",
  "trigger": { "type": "manual" },
  "nodes": [...]
}

# Execute flow
POST /api/flows/:flowId/run

# Update flow
PATCH /api/flows/:flowId

# Delete flow
DELETE /api/flows/:flowId
```

### Metrics

```bash
# Get workspace metrics
GET /api/workspace/metrics?timeRange=week

# Get flow analytics
GET /api/flows/:flowId/analytics?startDate=2025-11-01&endDate=2025-11-29

# Get smart insights
GET /api/insights
```

### Webhooks

```bash
# Register webhook
POST /api/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["flow.completed", "flow.failed"]
}

# Webhook payload example
{
  "event": "flow.completed",
  "flowId": "flow_123",
  "executionId": "exec_456",
  "timestamp": "2025-11-29T10:13:33Z",
  "data": { ... }
}
```

Full API documentation available at `/api/docs` when running the server.

---

## 🛠️ Development

### Project Structure

```
cognitoflow/
├── src/
│   ├── components/          # React components
│   │   ├── flows/           # Flow-related components
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── common/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── server/
│   ├── api/                 # API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── workers/             # Background jobs
│   └── middleware/          # Express middleware
├── config/                  # Configuration files
├── prisma/                  # Database schema & migrations
├── tests/                   # Test suites
├── docs/                    # Documentation
└── scripts/                 # Build & deployment scripts
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/bulk-actions

# Make changes and test
npm run test
npm run lint
npm run type-check

# Commit with conventional commits
git commit -m "feat: add bulk pause/resume for flows"

# Push and create PR
git push origin feature/bulk-actions
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- flows.test.ts
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format
```

---

## 🚢 Deployment

### Production Build

```bash
# Build frontend and backend
npm run build

# Start production server
npm start

# Or use PM2
pm2 start ecosystem.config.js
```

### Environment-Specific Deployments

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Rollback deployment
npm run deploy:rollback
```

### Docker Deployment

```bash
# Build production image
docker build -t cognitoflow:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name cognitoflow \
  cognitoflow:latest
```

### Kubernetes

See [k8s/README.md](./k8s/README.md) for Kubernetes deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)

---

## 📞 Support

- 📖 [Documentation](https://docs.cognitoflow.com)
- 💬 [Community Forum](https://community.cognitoflow.com)
- 🐛 [Issue Tracker](https://github.com/your-org/cognitoflow/issues)
- 📧 Email: support@cognitoflow.com
- 💼 Enterprise: enterprise@cognitoflow.com

---

## 🗺️ Roadmap

### Q4 2025
- [ ] Advanced search with command palette
- [ ] Bulk operations for flows
- [ ] Custom dashboard widgets
- [ ] Mobile app (iOS/Android)

### Q1 2026
- [ ] AI-powered flow recommendations
- [ ] Advanced analytics with ML insights
- [ ] Multi-workspace support
- [ ] Marketplace for flow templates

### Q2 2026
- [ ] Real-time collaboration features
- [ ] Version control for flows
- [ ] Advanced debugging tools
- [ ] Enterprise SSO integration

---

**Made with ❤️ by the CognitoFlow Team**