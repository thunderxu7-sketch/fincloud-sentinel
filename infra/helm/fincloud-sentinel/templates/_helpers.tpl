{{- define "fincloud.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- define "fincloud.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "fincloud.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- define "fincloud.labels" -}}
app.kubernetes.io/name: {{ include "fincloud.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | quote }}
{{- end }}
{{- define "fincloud.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}{{ default (include "fincloud.fullname" .) .Values.serviceAccount.name }}{{ else }}{{ default "default" .Values.serviceAccount.name }}{{ end }}
{{- end }}
