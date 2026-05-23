# Non-Technical Overview

## What this system is

This is the backend system that powers a realtor platform. It helps realtors manage listings, receive leads, and communicate with clients.

## What users can do

- Realtors can sign up and manage property listings.
- Prospective clients can browse public realtor pages and properties.
- Leads can be submitted from public property pages.
- Phone verification supports trusted communication workflows.

## Why this matters

It centralizes key realtor operations in one system and provides controlled public sharing via profile/property links.

## Safety and reliability

The system includes:

- access controls (who can do what),
- request limits to reduce abuse,
- monitoring hooks for error tracking,
- deployment configuration for cloud hosting.

## Current deployment target

The service is prepared for deployment to Render, with environment-based configuration and health endpoints.

## Important note

Some features depend on external setup (database and secrets). Without those, the system can run in limited/degraded mode for infrastructure validation only.
