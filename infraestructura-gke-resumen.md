# Resumen de Infraestructura GKE - Cluster CGE

**Cluster**: `gke_cge-infrastructure_southamerica-west1_cge-cluster`
**Región**: `southamerica-west1`
**Versión Kubernetes**: `v1.33.4-gke.1172000`

---

## ⚠️ HALLAZGO CRÍTICO: Namespace Production Apagado

**TODOS los deployments del namespace `production` están escalados a 0 replicas.**

- **31 deployments** con `0/0` replicas (no hay pods corriendo)
- **0 pods** activos en el namespace production
- Los **7 nodos production** (n2d-standard-4) **SÍ están activos** pero ejecutando:
  - ✅ Pods de **staging** (OpenSearch, microservicios, ingress)
  - ✅ Pods del **sistema** (devops, kube-system)
  - ❌ **NO** pods de production

**Implicación**: Recursos costosos (28 vCPUs, 112 GB RAM) siendo utilizados por staging en lugar de production.

---

## 1. Cantidad de Nodos del Cluster GKE

**Total: 37 nodos GCP VM** distribuidos en 2 node pools:

- **Production pool**: 7 nodos
- **Spot QAS nodes pool**: 30 nodos

---

## 2. Especificaciones de Nodos por Node Pool

### 2.1 Nodos de Production (7 nodos) ⚠️ ACTUALMENTE NO USADOS POR PRODUCTION

| Especificación | Detalle |
|----------------|---------|
| **Tipo de instancia GCP** | `n2d-standard-4` |
| **Familia de máquina** | n2d (AMD EPYC) |
| **Sistema Operativo** | Container-Optimized OS from Google |
| **Versión del Kernel** | 6.6.97+ |
| **CPU** | 4 vCPUs (3.92 allocatable) |
| **RAM** | 16 GB total (13.5 GB allocatable) |
| **Storage (Boot Disk)** | 45 GB (pd-balanced) |
| **Container Runtime** | containerd 2.0.6 |
| **Zona de disponibilidad** | southamerica-west1-b |
| **Tipo de provisioning** | Standard (no preemptible) |
| **Red** | Nodos privados (sin IP externa) |
| **Estado actual** | ⚠️ **Ejecutando pods de STAGING y sistema, NO production** |

**Nombres de los nodos**:
- gke-cge-cluster-production-0ef717f5-bi6t
- gke-cge-cluster-production-0ef717f5-hpeo
- gke-cge-cluster-production-0ef717f5-s9so
- gke-cge-cluster-production-0ef717f5-wj2v
- gke-cge-cluster-production-cb932826-6tnz
- gke-cge-cluster-production-cb932826-7j9q
- gke-cge-cluster-production-cb932826-jpj3

### 2.2 Nodos Spot QAS (30 nodos)

| Especificación | Detalle |
|----------------|---------|
| **Tipo de instancia GCP** | `t2d-standard-2` |
| **Familia de máquina** | t2d (AMD EPYC) |
| **Sistema Operativo** | Container-Optimized OS from Google |
| **Versión del Kernel** | 6.6.97+ |
| **CPU** | 2 vCPUs (1.93 allocatable) |
| **RAM** | 8 GB total (6 GB allocatable) |
| **Storage (Boot Disk)** | 45 GB (pd-balanced) |
| **Container Runtime** | containerd 2.0.6 |
| **Zona de disponibilidad** | southamerica-west1-a |
| **Tipo de provisioning** | **Preemptible (Spot)** |
| **Red** | Nodos privados (sin IP externa) |

**Nota**: Los nodos Spot son instancias preemptible de bajo costo que pueden ser terminadas por GCP con poco aviso.

---

## 3. Redis - RAM y Versión

### ⚠️ Importante: Redis NO es GCP Memory Store

El cluster utiliza **Redis self-managed** corriendo como StatefulSet dentro de Kubernetes, usando la imagen de Bitnami Redis. **No es un servicio administrado GCP Memory Store**.

### 3.1 Redis en Production

| Especificación | Detalle |
|----------------|---------|
| **Versión** | Redis 7.0.11 (Bitnami imagen) |
| **Tipo** | StatefulSet con Sentinel |
| **Namespace** | production |
| **Replicas actuales** | 0 (escalado a 0) |
| **Storage por pod** | 8 GiB (PVC con standard-rwo) |
| **Service Name** | cge-production-redis |
| **Cluster IP** | 34.118.236.194 |
| **Puertos** | 6379 (Redis), 26379 (Sentinel) |

### 3.2 Redis en Staging

| Especificación | Detalle |
|----------------|---------|
| **Versión** | Redis 7.0.11 (Bitnami imagen) |
| **Tipo** | StatefulSet con Sentinel |
| **Namespace** | staging |
| **Replicas actuales** | 1 |
| **Storage por pod** | 8 GiB (PVC con standard-rwo) |
| **Service Name** | cge-staging-redis |
| **Cluster IP** | 34.118.226.17 |
| **Puertos** | 6379 (Redis), 26379 (Sentinel) |

---

## 4. Arquitectura Referencial de Infraestructura en GCP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GCP Region: southamerica-west1                          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │           GKE Cluster: cge-cluster (v1.33.4-gke.1172000)              │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐    │ │
│  │  │ Node Pools                                                  │    │ │
│  │  │                                                             │    │ │
│  │  │  ┌─────────────────────────────────────────┐               │    │ │
│  │  │  │ Production Pool (southamerica-west1-b)  │               │    │ │
│  │  │  │  • 7 nodos n2d-standard-4              │               │    │ │
│  │  │  │  • 4 vCPU, 16 GB RAM cada uno          │               │    │ │
│  │  │  │  • Total: 28 vCPU, 112 GB RAM          │               │    │ │
│  │  │  └─────────────────────────────────────────┘               │    │ │
│  │  │                                                             │    │ │
│  │  │  ┌─────────────────────────────────────────┐               │    │ │
│  │  │  │ Spot QAS Pool (southamerica-west1-a)    │               │    │ │
│  │  │  │  • 30 nodos t2d-standard-2             │               │    │ │
│  │  │  │  • 2 vCPU, 8 GB RAM cada uno           │               │    │ │
│  │  │  │  • Total: 60 vCPU, 240 GB RAM          │               │    │ │
│  │  │  │  • Preemptible (Spot instances)        │               │    │ │
│  │  │  └─────────────────────────────────────────┘               │    │ │
│  │  └─────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐    │ │
│  │  │ Namespaces y Servicios                                      │    │ │
│  │  │                                                             │    │ │
│  │  │  📦 production ⚠️ COMPLETAMENTE APAGADO (0 pods)             │    │ │
│  │  │     ├── ❌ Ingress NGINX Controller (0/0 replicas)         │    │ │
│  │  │     │   └── LoadBalancer: 34.0.60.44 (sin endpoints)      │    │ │
│  │  │     ├── ❌ Redis StatefulSet (0 replicas, apagado)         │    │ │
│  │  │     ├── ❌ Core Services (0/0 replicas)                    │    │ │
│  │  │     │   ├── core (0/0)                                     │    │ │
│  │  │     │   └── core-internal (0/0)                            │    │ │
│  │  │     ├── ❌ Microservicios (31 deployments, TODOS 0/0)      │    │ │
│  │  │     │   ├── svc-auth (0/0)                                 │    │ │
│  │  │     │   ├── svc-analytics (0/0)                            │    │ │
│  │  │     │   ├── svc-notes (0/0)                                │    │ │
│  │  │     │   ├── svc-notifications (0/0)                        │    │ │
│  │  │     │   ├── svc-scheduler-api/cron/process (0/0)           │    │ │
│  │  │     │   ├── svc-search, svc-sql, svc-tables (0/0)          │    │ │
│  │  │     │   ├── svc-webhooks, svc-media-processing (0/0)       │    │ │
│  │  │     │   └── svc-workload-manager, svc-bulk-loader (0/0)    │    │ │
│  │  │     ├── ❌ Bases de Datos (statefulsets apagados)          │    │ │
│  │  │     └── ❌ Herramientas (0/0 replicas)                     │    │ │
│  │  │                                                             │    │ │
│  │  │     **NOTA**: Namespace existe pero NO tiene cargas activas│    │ │
│  │  │                                                             │    │ │
│  │  │  📦 staging ✅ ACTIVO (usando nodos production)              │    │ │
│  │  │     ├── ✅ Ingress NGINX Controller (LoadBalancer)         │    │ │
│  │  │     │   └── External IP: 34.0.60.90 (activo)              │    │ │
│  │  │     ├── ✅ Redis StatefulSet (1 replica, 8Gi storage)      │    │ │
│  │  │     ├── ✅ OpenSearch Cluster (corriendo en nodos prod)    │    │ │
│  │  │     │   ├── opensearch-cluster-nodes (StatefulSet)         │    │ │
│  │  │     │   └── opensearch-cluster-dashboards                  │    │ │
│  │  │     ├── ✅ Core Services (activos)                         │    │ │
│  │  │     ├── ✅ Microservicios (múltiples pods activos)         │    │ │
│  │  │     ├── ✅ Bases de Datos (pgsql, rabbitmq activos)        │    │ │
│  │  │     └── ✅ cge-services, cge-reports                       │    │ │
│  │  │                                                             │    │ │
│  │  │     **NOTA**: Staging usa nodos del production pool        │    │ │
│  │  │                                                             │    │ │
│  │  │  📦 devops (Observabilidad)                                │    │ │
│  │  │     ├── Prometheus Stack                                   │    │ │
│  │  │     │   ├── Prometheus Server                              │    │ │
│  │  │     │   ├── Grafana                                        │    │ │
│  │  │     │   ├── AlertManager                                   │    │ │
│  │  │     │   └── Node Exporter (DaemonSet)                      │    │ │
│  │  │     ├── Elastic Stack                                      │    │ │
│  │  │     │   ├── Elasticsearch (ECK operator)                   │    │ │
│  │  │     │   ├── Kibana                                         │    │ │
│  │  │     │   ├── APM Server                                     │    │ │
│  │  │     │   └── Filebeat (DaemonSet)                           │    │ │
│  │  │     └── Kube-State-Metrics                                 │    │ │
│  │  │                                                             │    │ │
│  │  │  📦 kube-system                                             │    │ │
│  │  │     ├── CoreDNS                                            │    │ │
│  │  │     ├── Metrics Server                                     │    │ │
│  │  │     ├── Antrea CNI (networking)                            │    │ │
│  │  │     ├── Konnectivity Agent                                 │    │ │
│  │  │     └── GKE System Components                              │    │ │
│  │  │                                                             │    │ │
│  │  │  📦 cert-manager                                            │    │ │
│  │  │     └── Cert Manager (TLS certificate management)          │    │ │
│  │  └─────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Balanceadores de Carga GCP (Network Tier: Standard)                  │ │
│  │                                                                       │ │
│  │  🌐 Production LoadBalancer → 34.0.60.44                             │ │
│  │     └── Ingress NGINX Controller (production namespace)              │ │
│  │                                                                       │ │
│  │  🌐 Staging LoadBalancer → 34.0.60.90                                │ │
│  │     └── Ingress NGINX Controller (staging namespace)                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Almacenamiento Persistente                                           │ │
│  │                                                                       │ │
│  │  💾 Persistent Disks (pd-balanced)                                   │ │
│  │     ├── Standard-RWO StorageClass                                    │ │
│  │     └── Usado para Redis, PostgreSQL, Elasticsearch, etc.            │ │
│  │                                                                       │ │
│  │  💾 FileStore CSI (NFS)                                              │ │
│  │     └── Para volúmenes compartidos entre pods                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Conectividad y Networking

### 5.1 Balanceadores de Carga

| Ambiente | IP Externa | Namespace | Tipo | Network Tier | Estado |
|----------|-----------|-----------|------|--------------|--------|
| **Production** | 34.0.60.44 | production | LoadBalancer | Standard | ⚠️ **Sin endpoints activos** |
| **Staging** | 34.0.60.90 | staging | LoadBalancer | Standard | ✅ **Activo** |

### 5.2 Configuración de Red

- **CNI**: Antrea (Container Network Interface)
- **Nodos**: Privados (sin IPs externas)
- **Pod CIDR**: 10.112.0.0/14
- **Service CIDR**: 34.118.224.0/20
- **DNS interno**: CoreDNS (kube-dns service)
- **Konnectivity**: Para comunicación control plane ↔ worker nodes

### 5.3 Ingress Controllers

- **Staging**: NGINX Ingress Controller v1.6.4 (LoadBalancer) - ✅ **Activo** con endpoints
- **Production**: NGINX Ingress Controller v1.6.4 (LoadBalancer) - ⚠️ **0/0 replicas, sin endpoints**

---

## 6. Resumen de Capacidad Total

| Recurso | Production Pool | Spot QAS Pool | **Total** |
|---------|----------------|---------------|-----------|
| **Nodos** | 7 | 30 | **37** |
| **vCPUs** | 28 | 60 | **88 vCPUs** |
| **RAM** | 112 GB | 240 GB | **352 GB** |
| **Storage (Boot)** | 315 GB | 1,350 GB | **1,665 GB** |
| **Tipo instancia** | n2d-standard-4 | t2d-standard-2 | Mixed |

---

## 6.1. Uso Real Actual de los Nodos

### Nodos Production Pool (7 nodos) - ⚠️ NO ejecutando production

**Pods activos en nodos production** (ejemplo de 1 nodo):
- **Staging**: 9 pods
  - `cge-staging-ingress-nginx-controller`
  - `opensearch-cluster-dashboards`
  - `opensearch-cluster-nodes-0`
  - `svc-minicore`, `svc-notes`, `svc-pbdocs`
  - `svc-scheduler-process` (2 replicas)
  - `svc-webhooks`, `us-router`
- **DevOps**: 4 pods
  - `filebeat`, `grafana`, `kube-state-metrics`, `node-exporter`
- **Kube-system**: 9 pods
  - `anetd`, `antrea-controller`, `filestore-node`
  - `konnectivity-agent`, `netd`, `pdcsi-node`, etc.

**Total por nodo production**: ~22 pods (0 de production, todos de staging/sistema)

### Nodos Spot QAS Pool (30 nodos) - ✅ Ejecutando staging mayormente

**Pods activos en nodos spot** (ejemplo):
- **Staging**: Mayoría de microservicios y bases de datos
- **DevOps**: Filebeat, node-exporter
- **Kube-system**: Componentes de red y storage

---

## 7. Componentes Clave de Infraestructura

### 7.1 Observabilidad y Monitoreo

- **Prometheus + Grafana**: Métricas de cluster y aplicaciones
- **Elasticsearch + Kibana**: Logs centralizados
- **APM Server**: Application Performance Monitoring
- **Filebeat**: Recolección de logs (DaemonSet en todos los nodos)
- **Node Exporter**: Métricas de sistema operativo
- **Kube-State-Metrics**: Métricas de objetos Kubernetes

### 7.2 Bases de Datos y Storage

- **PostgreSQL**: Múltiples instancias (principal, hedgedoc, metabase)
- **Redis**: Self-managed con Sentinel (8Gi storage)
- **Elasticsearch**: Para búsqueda y logs (production)
- **OpenSearch**: Cluster para staging
- **RabbitMQ**: Message broker para async processing

### 7.3 Seguridad y Certificados

- **Cert-Manager**: Gestión automática de certificados TLS
- **Private Nodes**: Todos los nodos sin IP pública
- **Container-Optimized OS**: Sistema operativo endurecido de Google

---

## 8. Consideraciones Importantes

### 🚨 CRÍTICO: Namespace Production Completamente Apagado

**Estado actual**:
- ❌ **31 deployments** en production con **0/0 replicas**
- ❌ **0 pods activos** en el namespace production
- ❌ Load Balancer production (34.0.60.44) **sin endpoints**
- ❌ Redis production **escalado a 0**
- ❌ Todos los microservicios (core, svc-auth, svc-analytics, etc.) **apagados**

**Servicios que NO están disponibles**:
- Core, Core-Internal
- 25+ microservicios (auth, analytics, notes, scheduler, etc.)
- Bases de datos (PostgreSQL, Redis, Elasticsearch, RabbitMQ)
- Herramientas (Metabase, Hedgedoc, Webclient)

**Implicación**: El ambiente de producción está **completamente fuera de servicio**.

### 💰 Oportunidad de Optimización de Costos

**Situación actual**:
- 7 nodos production (n2d-standard-4) = **~$550-700 USD/mes**
- Estos nodos están ejecutando **solo staging y sistema**, no production
- Production pool podría **reducirse o eliminarse** temporalmente

**Recomendaciones**:
1. **Si production está intencionalmente apagado**:
   - Reducir production pool a 0-2 nodos
   - Ahorro estimado: **$400-600 USD/mes**
2. **Si es un error**:
   - Escalar deployments de production a sus valores normales
   - Verificar por qué se apagó production

### ⚠️ Nodos Spot (Preemptible)

Los 30 nodos del pool "Spot QAS" son instancias preemptible:
- **Costo reducido**: ~60-80% más baratos que nodos estándar
- **Disponibilidad**: Pueden ser terminados por GCP con 30 segundos de aviso
- **Uso recomendado**: Cargas de trabajo tolerantes a fallos, ambientes QA/staging
- **Uso actual**: Ejecutando staging activamente

### 📊 Utilización de Recursos

Ejemplo de un nodo production (n2d-standard-4):
- **CPU Request**: 57% utilizado (2.25 de 3.92 cores)
- **CPU Limits**: 302% (overcommitted para burst capacity)
- **Memory Request**: 38% utilizado (5.3 GB de 13.5 GB)
- **Memory Limits**: 148% (overcommitted)
- **Workloads**: 22 pods (staging: 9, devops: 4, sistema: 9, **production: 0**)

### 🔐 Redis Self-Managed

Redis NO es un servicio administrado (Memory Store):
- Requiere mantenimiento manual
- Backups deben ser configurados
- Actualizaciones de versión son manuales
- Ventaja: Mayor control y configuración
- **Production Redis**: Actualmente escalado a 0 replicas
- **Staging Redis**: 1 replica activa con 8Gi storage

---

## 9. Información Adicional

- **Cluster creado**: 14 de noviembre de 2024
- **Region GCP**: southamerica-west1 (Santiago, Chile)
- **Project ID**: cge-infrastructure
- **Container Runtime**: containerd 2.0.6
- **Max pods por nodo**: 110

---

**Documento generado**: 1 de octubre de 2025
**Fuente**: Kubernetes API del cluster `gke_cge-infrastructure_southamerica-west1_cge-cluster`
