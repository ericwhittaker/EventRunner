# 🔐 Convex Auth Implementation Progress

## Overview
Implementing Convex Auth (beta) in EventRunner Angular app to replace mock authentication with real auth providers.

## Technical Approach
- **Phase 1**: Simple email/password auth (easier to implement and test)
- **Phase 2**: Google OAuth (after Phase 1 is working)
- **Framework**: Use `convex-angular` library for Angular integration
- **Strategy**: Extend existing auth service to use Convex Auth

## 📋 Implementation Tasks

### Phase 1: Basic Convex Auth Setup
- [ ] **Task 1.1**: Install and configure `@convex-dev/auth` package
  - Status: ❌ TODO
  - Details: Add Convex Auth to backend
  
- [ ] **Task 1.2**: Install `convex-angular` library for better Angular integration
  - Status: ❌ TODO  
  - Details: Replace custom ConvexService with convex-angular

- [ ] **Task 1.3**: Configure Convex Auth in backend (`convex/auth.ts`)
  - Status: ❌ TODO
  - Details: Setup password provider and auth configuration

- [ ] **Task 1.4**: Update Convex schema to support auth
  - Status: ❌ TODO
  - Details: Add auth-related tables if needed

- [ ] **Task 1.5**: Create Convex auth functions (signup, signin, signout)
  - Status: ❌ TODO
  - Details: Backend auth mutations and queries

### Phase 2: Angular Frontend Integration  
- [ ] **Task 2.1**: Replace ConvexService with convex-angular
  - Status: ❌ TODO
  - Details: Use `injectQuery`, `injectMutation`, `provideConvex`

- [ ] **Task 2.2**: Update AuthService to use Convex Auth
  - Status: ❌ TODO
  - Details: Replace mock auth with real Convex Auth calls

- [ ] **Task 2.3**: Update login component to use new auth flow
  - Status: ❌ TODO
  - Details: Wire up signup/signin forms

- [ ] **Task 2.4**: Update auth guard and header components
  - Status: ❌ TODO
  - Details: Use real auth state

- [ ] **Task 2.5**: Test authentication flow end-to-end
  - Status: ❌ TODO
  - Details: Verify signup, login, logout works

### Phase 3: Google OAuth (Future)
- [ ] **Task 3.1**: Configure Google OAuth provider in Convex Auth
  - Status: ❌ TODO
  - Details: Add Google provider configuration

- [ ] **Task 3.2**: Handle OAuth callback in Electron
  - Status: ❌ TODO  
  - Details: Research Electron OAuth flow

- [ ] **Task 3.3**: Implement OAuth login UI
  - Status: ❌ TODO
  - Details: Add "Sign in with Google" button

## 🔧 Technical Notes

### Convex Auth Beta Limitations
- Currently designed for React (we're using Angular)
- Beta software - may have breaking changes
- Documentation is React-focused

### Angular Integration Strategy
- Use `convex-angular` library by azhukau-dev for Angular signals integration
- Replace our custom ConvexService with their implementation
- Keep our auth service interface but make it use Convex Auth backend

### Electron Considerations  
- OAuth callbacks need special handling in Electron
- May need to open system browser for OAuth flow
- Will address in Phase 3

## 📝 Decision Log

**2025-01-24**: Decided to use email/password auth first, then Google OAuth
**2025-01-24**: Will use `convex-angular` library instead of custom ConvexService
**2025-01-24**: Keep existing auth service interface for minimal frontend changes

## 🚀 Next Steps

1. **START WITH**: Task 1.1 - Install Convex Auth package
2. **FOCUS**: Get basic email/password auth working first
3. **TEST**: Each task thoroughly before moving to next
4. **DEBUG**: Use this document to track issues and solutions

---
*This document will be updated as we progress through implementation*
