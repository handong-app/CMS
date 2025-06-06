![Docker](https://img.shields.io/badge/Container-Docker-blue?logo=docker)
![Nginx](https://img.shields.io/badge/WebServer-Nginx-green?logo=nginx)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot%20(Java%2017)-6DB33F?logo=springboot)
![MariaDB](https://img.shields.io/badge/Database-MariaDB-003545?logo=mariadb)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)
![MUI](https://img.shields.io/badge/UI-MUI-007FFF?logo=mui)
![Python](https://img.shields.io/badge/Worker-Python%203.12-yellow?logo=python)
![FFmpeg](https://img.shields.io/badge/Transcoder-FFmpeg-black?logo=ffmpeg)
![RabbitMQ](https://img.shields.io/badge/Queue-RabbitMQ-FF6600?logo=rabbitmq)
![MinIO](https://img.shields.io/badge/Storage-MinIO-red?logo=minio)
![Infisical](https://img.shields.io/badge/Secrets-Infisical-2B90B6)

# 🎬 CMS

## 📚 목차

- [소개](#소개)
- [🎯 주요 목적](#-주요-목적)
- [🔑 주요 기능 요약](#-주요-기능-요약)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [🖥️ Client Environment](#️-client-environment)
- [🤝 Dev & Collaboration Tools](#-dev--collaboration-tools)
- [🧪 테스트 및 품질 관리](#-테스트-및-품질-관리)
- [🔄 CI/CD & 자동 배포](#-cicd--자동-배포)

---

## 소개

> 본 프로젝트는 대학 동아리 활동을 위한 **온라인 콘텐츠 공유 및 관리 플랫폼**입니다. 회원들은 강의 영상과 학습 자료를 업로드하고, 서로의 진행 상황을 공유하며, 효과적인 학습 및 소통을 이어갈 수 있습니다.

---

## 🎯 주요 목적

- 동아리 멤버 간의 **지식 공유와 협업**을 지원
- 다양한 형태의 콘텐츠(영상, 파일, 이미지, 텍스트, 퀴즈 등)를 통합 관리
- 사용자별 시청 이력과 학습 상태를 쉽게 추적
- 관리자는 멤버 정보와 클럽 소개를 간편하게 관리 가능

---

## 🔑 주요 기능 요약

- 🔐 **로그인 상태에 따른 정보 분리**  
- 🔍 **강의 검색 기능**  
- 📊 **시청 이력 확인**  
- 💬 **영상 내 댓글 기능**  
- 📦 **다양한 콘텐츠 업로드 지원**  
- 🛠 **클럽 정보 관리**

> 이 플랫폼은 단순한 콘텐츠 보관을 넘어, **참여 중심의 학습 환경**을 구현하는 것을 목표로 합니다. 프론트엔드부터 백엔드, 미디어 처리까지 모든 영역이 통합되어 있습니다.

---

## 📂 프로젝트 구조

![Architecture_Diagram_v3](https://github.com/user-attachments/assets/76eb492d-4023-4b0f-949f-12e35657246c)

- **Frontend**: React + Vite 기반 사용자 인터페이스
- **Backend**: Spring Boot 기반 API 서버
- **Storage**: MinIO (S3 호환)
- **Message Queue**: RabbitMQ
- **Worker**:  
  트랜스코딩 요청을 비동기적으로 처리하는 Python Celery 워커  
  ▶ [cms-transcode-worker GitHub 저장소 바로가기](https://github.com/handong-app/cms-transcode-worker)


---

## 🖥️ Client Environment

| 항목              | 내용             |
|-------------------|------------------|
| **Build Tool**     | Vite             |
| **Language**        | TypeScript       |
| **Frontend Framework** | React         |
| **UI Framework**     | Material UI (MUI) |

---

## 🤝 Dev & Collaboration Tools

| 항목              | 내용               |
|-------------------|--------------------|
| **Version Control** | GitHub             |
| **Code Review**     | Coderabbitai       |
| **CI/CD**           | GitHub Actions     |
| **Communication**   | Discord            |
| **PM Tools**        | Notion             |

---

## 🧪 테스트 및 품질 관리

- 본 프로젝트는 **TDD(Test-Driven Development)** 관점에서 테스트를 설계 및 작성했습니다.
- 프론트엔드는 **Vitest**를 사용하여 컴포넌트 및 유틸 함수 단위 테스트를 수행했습니다.
- 빠른 실행 속도와 `--watch` 모드를 통해 실시간 피드백 환경을 구성했습니다.

---

## 🔄 CI/CD & 자동 배포

- GitHub Actions 기반 **CI/CD Pipeline** 구축
  - PR 시 자동 테스트 및 빌드
  - main 브랜치 머지 시 자동 배포
  - Docker 기반 자동 이미지 배포 적용

```bash
# 예시 워크플로우 흐름
Push → Test & Build → Docker Image 생성 → Auto Deploy
