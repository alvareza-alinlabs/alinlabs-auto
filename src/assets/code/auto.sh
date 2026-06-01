#!/bin/bash

# SYNOPSIS
#     Cyber Auto Git-Push Script (BASH)
# DESCRIPTION
#     Script push otomatis dengan parameter yang sudah dikonfigurasi. Developed by AlinLabs.

# Konfigurasi Warna
C_CYAN='\033[0;36m'
C_DARKCYAN='\033[1;36m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_RED='\033[0;31m'
C_WHITE='\033[1;37m'
C_NC='\033[0m' # No Color

function write_cyber_header() {
    echo -e ""
    echo -e "${C_DARKCYAN} =======================================================${C_NC}"
    echo -e "${C_CYAN}  > $1${C_NC}"
    echo -e "${C_DARKCYAN} =======================================================${C_NC}"
    echo -e ""
}

function write_cyber_info() { echo -e "${C_DARKCYAN} [~] $1${C_NC}"; }
function write_cyber_success() { echo -e "${C_GREEN} [+] $1${C_NC}"; }
function write_cyber_warn() { echo -e "${C_YELLOW} [!] $1${C_NC}"; }
function write_cyber_error() { echo -e "${C_RED} [x] $1${C_NC}"; }

function show_cyber_loading() {
    echo -e "${C_DARKCYAN} [~] $1${C_NC}"
    sleep 0.3
    echo -ne "\033[1A\033[2K"
    echo -e "${C_DARKCYAN} [~] $1 ${C_GREEN}✓${C_NC}"
}

clear
cat << "EOF"
   █████████   █████  █████ ███████████    ███████   
  ███▒▒▒▒▒███ ▒▒███  ▒▒███ ▒█▒▒▒███▒▒▒█  ███▒▒▒▒▒███ 
 ▒███    ▒███  ▒███   ▒███ ▒   ▒███  ▒  ███     ▒▒███
 ▒███████████  ▒███   ▒███     ▒███    ▒███      ▒███
 ▒███▒▒▒▒▒███  ▒███   ▒███     ▒███    ▒███      ▒███
 ▒███    ▒███  ▒███   ▒███     ▒███    ▒▒███     ███ 
 █████   █████ ▒▒████████      █████    ▒▒▒███████▒  
▒▒▒▒▒   ▒▒▒▒▒   ▒▒▒▒▒▒▒▒      ▒▒▒▒▒       ▒▒▒▒▒▒▒    

   --> Alinlabs Utility Technology Operations (BASH AUTO) <--
EOF

write_cyber_header "INISIALISASI SISTEM (AUTO MODE)"

show_cyber_loading "Memeriksa modul Git..."
if ! command -v git &> /dev/null; then
    write_cyber_warn "Git tidak ditemukan di sistem."
    show_cyber_loading "Mencoba menginstal Git..."
    if command -v pkg &> /dev/null && [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
        pkg update -y > /dev/null 2>&1
        pkg install git -y > /dev/null 2>&1
    elif command -v apk &> /dev/null; then
        apk update > /dev/null 2>&1
        apk add git > /dev/null 2>&1
    elif command -v brew &> /dev/null; then
        brew install git > /dev/null 2>&1
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update > /dev/null 2>&1 || true
        sudo apt-get install git -y > /dev/null 2>&1 || true
    fi
    
    if ! command -v git &> /dev/null; then
        write_cyber_error "Gagal menginstal Git secara otomatis. Harap instal Git secara manual."
        read -p " [>] Tekan [ENTER] untuk membatalkan"
        exit 1
    fi
    write_cyber_success "Git berhasil diinstal."
else
    GIT_VERSION=$(git --version)
    write_cyber_info "Versi Git saat ini: $GIT_VERSION"

    show_cyber_loading "Mencoba memperbarui Git ke versi terbaru..."
    if command -v pkg &> /dev/null && [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
        pkg update -y > /dev/null 2>&1
        pkg install git -y > /dev/null 2>&1
    elif command -v apk &> /dev/null; then
        apk update > /dev/null 2>&1
        apk add git > /dev/null 2>&1
    elif command -v brew &> /dev/null; then
        brew upgrade git > /dev/null 2>&1
    elif command -v apt-get &> /dev/null; then
        sudo apt-get install git -y > /dev/null 2>&1 || true
    fi
fi

GIT_VERSION_NEW=$(git --version)
write_cyber_success "Git siap: $GIT_VERSION_NEW (Terinstall/Terupdate)"

PROJECT_PATH="__PARAM_PATH__"
GITHUB_USERNAME="__PARAM_USERNAME__"
GITHUB_TOKEN="__PARAM_TOKEN__"
REPO_NAME="__PARAM_REPO__"
TARGET_BRANCH="__PARAM_BRANCH__"
LFS_EXTS="__PARAM_LFS_EXTS__"
LFS_SIZE="__PARAM_LFS_SIZE__"

if [ ! -d "$PROJECT_PATH" ]; then
    write_cyber_error "Direktori target tidak ditemukan: $PROJECT_PATH"
    read -p " [>] Tekan [ENTER] untuk membatalkan"
    exit 1
fi

cd "$PROJECT_PATH"
write_cyber_success "Akses ruang kerja diizinkan: $PROJECT_PATH"

write_cyber_header "MEMERIKSA KONEKSI REPOSITORI"
show_cyber_loading "Mengecek status repositori di GitHub..."

API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME")
if [ "$API_RESPONSE" == "200" ]; then
    write_cyber_success "Repositori '$REPO_NAME' ditemukan di GitHub."
else
    write_cyber_warn "Repositori '$REPO_NAME' tidak ditemukan. Membuat repositori '$REPO_NAME'..."
    CREATE_RES=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: token $GITHUB_TOKEN" -d "{\"name\":\"$REPO_NAME\", \"private\":false}" "https://api.github.com/user/repos")
    if [ "$CREATE_RES" == "201" ]; then
        write_cyber_success "Repositori '$REPO_NAME' berhasil dibuat."
    else
        write_cyber_error "Gagal membuat repositori otomatis. (HTTP $CREATE_RES)"
        read -p " [>] Tekan [ENTER] untuk keluar session"
        exit 1
    fi
fi

REMOTE_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

show_cyber_loading "Mengecek status repositori lokal..."
if [ ! -d ".git" ]; then
    write_cyber_warn "Repositori Git belum diinisialisasi. Memulai inisialisasi..."
    git init > /dev/null 2>&1
    git branch -M "$TARGET_BRANCH" > /dev/null 2>&1
    git remote add origin "$REMOTE_URL" > /dev/null 2>&1
    write_cyber_success "Repositori lokal berhasil dibuat."
else
    if ! git remote | grep -q "^origin$"; then
        git remote add origin "$REMOTE_URL" > /dev/null 2>&1
    else
        git remote set-url origin "$REMOTE_URL" > /dev/null 2>&1
    fi
    write_cyber_success "Remote URL (origin) diperbarui."
fi

# Menonaktifkan credential helper lokal agar token baru selalu digunakan (logout effect)
git config --local credential.helper "" > /dev/null 2>&1

write_cyber_header "MENGEKSEKUSI GIT PAYLOAD"

show_cyber_loading "Mengaktifkan protokol LFS (Large File Storage)..."
git lfs install > /dev/null 2>&1

if [ -n "$LFS_EXTS" ]; then
    show_cyber_loading "Menerapkan aturan Git LFS..."
    IFS=',' read -ra ADDR <<< "$LFS_EXTS"
    for ext in "${ADDR[@]}"; do
        ext=$(echo "$ext" | xargs)
        if [ -n "$ext" ]; then
            if [[ "$ext" != \** ]]; then ext="*$ext"; fi
            git lfs track "$ext" > /dev/null 2>&1
        fi
    done
    git add .gitattributes > /dev/null 2>&1
fi

show_cyber_loading "Membangun indeks modifikasi (Staging Area)..."
git add . > /dev/null 2>&1

show_cyber_loading "Mengenkripsi metadata commit..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="[UPDATE-SISTEM] Auto-Push $TIMESTAMP"

if ! git status --porcelain | grep -q "."; then
    write_cyber_warn "Tidak ada perubahan sistem yang terdeteksi untuk di-commit."
else
    show_cyber_loading "Melakukan commit data..."
    git commit -m "$COMMIT_MSG" > /dev/null 2>&1
    write_cyber_success "Commit berhasil diterapkan: $COMMIT_MSG"
fi

show_cyber_loading "Mengkalibrasi uplink ke Node Utama (GitHub)..."
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    git branch -M "$TARGET_BRANCH" > /dev/null 2>&1
elif [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
    git branch -M "$TARGET_BRANCH" > /dev/null 2>&1
fi

show_cyber_loading "Membangun terowongan aman (Secure Tunnel)..."
show_cyber_loading "Mentransmisikan paket data (Push)..."

if git push origin "$TARGET_BRANCH" --force > push.log 2>&1; then
    write_cyber_header "DEPLOYMENT BERHASIL"
    write_cyber_success "Semua sistem berjalan normal."
    echo -e " [🔗] Tautan Repositori: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    write_cyber_header "KEGAGALAN SISTEM !"
    write_cyber_error "Transmisi ditolak. Rincian Error:"
    cat push.log
fi
rm -f push.log

echo ""
read -p " [>] Eksekusi selesai. Tekan [ENTER] untuk menutup sesi"
