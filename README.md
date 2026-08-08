# Phone Club Admin

Phone Club Admin Dashboard

Build a modern, responsive, premium-looking admin dashboard for my e-commerce mobile phone website called Phone Club.

This phase is UI only. Do not implement backend APIs or database integration. Use mock data throughout the application.

Design Requirements

Modern SaaS admin dashboard

Clean white background

Blue primary color (#2563EB)

Minimalistic UI with soft shadows

Responsive for desktop, tablet, and mobile

Use cards, tables, charts, badges, and modern icons

Smooth animations and hover effects

Professional spacing and typography

Use Tailwind CSS and shadcn/ui components

Sidebar Navigation

Create a collapsible left sidebar containing:

Dashboard

Orders

Products

Stock Management

Customers

Notifications

Reports

Settings

Display the Phone Club logo at the top.

Top Navigation

Include:

Search bar

Notification bell with unread count

Admin profile avatar

Theme toggle (light/dark UI only)

Dashboard

Display summary cards:

Total Orders

Today's Orders

Total Customers

Total Products

Available Products

Out of Stock Products

Low Stock Products

Each card should include:

Icon

Value

Small trend indicator

Subtitle

Example:

Total Orders
1,256
+12% this month

Dashboard Widgets

Recent Orders

Create a table with:

Order Number

Customer

Mobile Name

Amount

Payment Status

Order Status

Date

Status badges:

Pending

Confirmed

Packed

Shipped

Delivered

Cancelled

New Order Notifications

Create a notification panel showing:

🔔 New Order #PC10254 received

🔔 Order #PC10255 paid successfully

🔔 Samsung Galaxy S25 Ultra stock running low

🔔 iPhone 17 Pro Max is out of stock

Display notification timestamps.

Analytics

Add placeholder charts for:

Orders this week

Revenue this month

Top selling brands

Top selling mobiles

Use realistic dummy data.

Orders Page

Display a searchable table with:

Order Number

Customer

Email

Phone

Products

Quantity

Amount

Payment Method

Payment Status

Order Status

Created Date

Actions

Actions:

View

Edit

Print Invoice

Cancel

Filters:

Status

Payment Status

Date Range

Search

Pagination

Products Page

Display all mobile phones.

Columns:

Image

Brand

Model

Price

Stock

Availability

Last Updated

Actions

Add a large "Add Product" button.

The Add Product form should include:

Brand

Model Name

Slug

Price

MRP

Storage

RAM

Color

Processor

Operating System

Battery

Camera

Display

Description

Product Images

Thumbnail

Availability

Status

Save button

Cancel button

UI only.

Stock Management

Create a dedicated stock management page.

Include:

Upload Excel Card

Large drag-and-drop upload area.

Accept:

.xlsx

.xls

.csv

Display:

Upload Stock Excel

Drag & Drop

Browse File

Supported formats

After upload, display:

Filename

Upload progress

Success state

Error state

No backend implementation.

Stock Preview Table

Columns:

Brand

Model

Current Stock

New Stock

Status

Updated At

Highlight:

Low stock

Out of stock

Available

Bulk Actions

Buttons:

Upload Stock

Download Sample Excel

Download Current Stock

Export Stock

Stock Summary

Cards:

Available Products

Low Stock

Out of Stock

Recently Updated

Customers Page

Display:

Customer Name

Email

Phone

Orders

Total Spent

Joined Date

Status

Customer Profile button

Notifications Page

Timeline UI showing:

New Order

Payment Received

Low Stock

Product Added

Stock Updated

Customer Registered

Each notification should have:

Icon

Timestamp

Priority badge

Settings

Create settings UI sections:

Store Information

Admin Profile

Notification Preferences

Email Settings

Theme

Security

No backend required.

Components

Create reusable components:

Dashboard Card

Data Table

Status Badge

Notification Item

Sidebar

Top Navbar

Upload Area

Modal

Search Input

Pagination

Charts

Statistic Cards

Buttons

UX

Add:

Loading skeletons

Empty states

Hover animations

Responsive tables

Nice transitions

Professional spacing

Modern typography

Rounded cards

Subtle gradients

Mock Data

Populate the UI with realistic data:

Around 50 products

25 recent orders

15 customers

10 notifications

Stock information

Charts

Everything should appear production-ready.

Important

Do NOT implement backend logic.

Do NOT create API calls.

Do NOT use a database.

Use mock JSON data only.

Structure the project so it is easy to connect to a Node.js backend later.

Generate clean, reusable React components with proper folder organization and maintainable code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8d17fbd2-7525-4605-b9f2-6e8970e80836).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
