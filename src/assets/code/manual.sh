#!/bin/bash

# SYNOPSIS
#     AUTO GIT PUSH (CYBERPUNK EDITION) - LINUX/MACOS VERSION
# DESCRIPTION
#     Script push manual interaktif. Developed by AlinLabs.

# Konfigurasi Warna
C_CYAN='\033[0;36m'
C_DARKCYAN='\033[1;36m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_RED='\033[0;31m'
C_WHITE='\033[1;37m'
C_DARKGRAY='\033[1;30m'
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

function read_cyber_input() {
    echo -ne "${C_CYAN} [>] $1 : ${C_NC}"
    read input_val
    echo "$input_val"
}

function show_cyber_loading() {
    echo -e "${C_DARKCYAN} [~] $1${C_NC}"
    sleep 0.5
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

   --> Alinlabs Utility Technology Operations (BASH) <--
EOF

CONFIG_DIR="$HOME/.git-auto-tool"
CONFIG_FILE="$CONFIG_DIR/token.json"

mkdir -p "$CONFIG_DIR"

write_cyber_header "INISIALISASI SISTEM"

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

PROJECT_PATH=$(read_cyber_input "Path Direktori Target")

if [ ! -d "$PROJECT_PATH" ]; then
    write_cyber_error "Path tidak ditemukan: $PROJECT_PATH"
    read -p " [>] Tekan [ENTER] untuk membatalkan"
    exit 1
fi

GITHUB_USERNAME=""
TOKEN=""

if [ -f "$CONFIG_FILE" ]; then
    # Di bash, kita baca via grep/awk sedehana jika tidak ada jq
    saved_username=$(grep -o '"username":"[^"]*' "$CONFIG_FILE" | grep -o '[^"]*$')
    saved_token=$(grep -o '"token":"[^"]*' "$CONFIG_FILE" | grep -o '[^"]*$')
    write_cyber_info "Kredensial Tersimpan Ditemukan:"
    write_cyber_info "Pengguna: $saved_username"
    write_cyber_info "Token   : ***************"
    
    echo ""
    USE_OLD_TOKEN=$(read_cyber_input "Gunakan kredensial aktif ini? (Y/N)")
    if [[ "$USE_OLD_TOKEN" =~ ^[Yy]$ ]]; then
        TOKEN="$saved_token"
        GITHUB_USERNAME="$saved_username"
    else
        TOKEN=$(read_cyber_input "Masukkan Token GitHub Baru")
        GITHUB_USERNAME=$(read_cyber_input "Masukkan Username GitHub Baru")
        echo "{\"username\":\"$GITHUB_USERNAME\", \"token\":\"$TOKEN\"}" > "$CONFIG_FILE"
        write_cyber_success "Kredensial Berhasil Diperbarui"
    fi
else
    write_cyber_warn "Tidak ada kredensial tersimpan"
    TOKEN=$(read_cyber_input "Masukkan Token GitHub")
    GITHUB_USERNAME=$(read_cyber_input "Masukkan Username GitHub")
    echo "{\"username\":\"$GITHUB_USERNAME\", \"token\":\"$TOKEN\"}" > "$CONFIG_FILE"
    write_cyber_success "Kredensial Berhasil Disimpan"
fi

REPO_NAME=$(read_cyber_input "Nama Repositori")

write_cyber_header "MEMERIKSA KONEKSI REPOSITORI"
show_cyber_loading "Mengecek status repositori di GitHub..."

REPO_EXISTS=false
while [ "$REPO_EXISTS" = false ]; do
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN" "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME")
    if [ "$API_RESPONSE" == "200" ]; then
        REPO_EXISTS=true
        write_cyber_success "Repositori '$REPO_NAME' ditemukan di GitHub."
    else
        write_cyber_warn "Repositori '$REPO_NAME' tidak ditemukan atau akses ditolak."
        echo -e "${C_CYAN}   [?] Kosongkan lalu [ENTER] untuk membuat repositori baru otomatis.${C_NC}"
        echo -e "${C_CYAN}   [?] Atau ketik nama repositori baru lalu [ENTER].${C_NC}"
        echo -ne "   > "
        read NEW_REPO_INPUT
        
        if [ -z "$NEW_REPO_INPUT" ]; then
            show_cyber_loading "Membuat repositori '$REPO_NAME'..."
            CREATE_RES=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: token $TOKEN" -d "{\"name\":\"$REPO_NAME\", \"private\":false}" "https://api.github.com/user/repos")
            if [ "$CREATE_RES" == "201" ]; then
                write_cyber_success "Repositori '$REPO_NAME' berhasil dibuat."
                REPO_EXISTS=true
            else
                write_cyber_error "Gagal membuat repositori otomatis. (HTTP $CREATE_RES)"
                read -p " [>] Tekan [ENTER] untuk keluar session"
                exit 1
            fi
        else
            REPO_NAME="$NEW_REPO_INPUT"
        fi
    fi
done

REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
BRANCH=$(read_cyber_input "Cabang Target (Bawaan: main)")
if [ -z "$BRANCH" ]; then BRANCH="main"; fi

echo ""
LFS_EXTS=$(read_cyber_input "Tulis eksistensi file Git LFS (contoh: .mp4, .zip)")
LFS_SIZE=""
if [ -n "$LFS_EXTS" ]; then
    LFS_SIZE=$(read_cyber_input "Size file spesifik (kosongkan jika semua ukuran)")
fi

echo ""
CUSTOM_COMMIT=$(read_cyber_input "Pesan Commit (Biarkan kosong untuk Auto Timestamp)")

clear
write_cyber_header "MANIFEST DEPLOYMENT"
echo -e "  [-] Path Target : ${C_WHITE}$PROJECT_PATH${C_NC}"
echo -e "  [-] Username    : ${C_WHITE}$GITHUB_USERNAME${C_NC}"
echo -e "  [-] Repositori  : ${C_WHITE}$REPO_NAME${C_NC}"
echo -e "  [-] URL Remote  : ${C_WHITE}$REPO_URL${C_NC}"
echo -e "  [-] Cabang      : ${C_WHITE}$BRANCH${C_NC}"

CONFIRM=$(read_cyber_input "Eksekusi Payload? (ENTER=YA / N=BATAL)")
if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
    write_cyber_error "Deployment Dibatalkan oleh Pengguna"
    exit 0
fi

clear
write_cyber_header "MENGEKSEKUSI GIT PAYLOAD"

cd "$PROJECT_PATH"

show_cyber_loading "Mengecek integritas ruang kerja (Workspace)..."
if [ ! -d ".git" ]; then
    write_cyber_warn "Git belum diinisialisasi. Menyuntikkan struktur Git..."
    git init > /dev/null 2>&1
    write_cyber_success "Inisialisasi Git Selesai"
fi

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

AUTH_REPO_URL="https://${GITHUB_USERNAME}:${TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

if ! git remote | grep -q "^origin$"; then
    write_cyber_info "Menyuntikkan Remote 'origin'..."
    git remote add origin "$AUTH_REPO_URL" > /dev/null 2>&1
else
    write_cyber_info "Memperbarui Remote 'origin'..."
    git remote set-url origin "$AUTH_REPO_URL" > /dev/null 2>&1
fi

# Menonaktifkan credential helper lokal agar token baru (dari URL) selalu digunakan
git config --local credential.helper "" > /dev/null 2>&1

show_cyber_loading "Membangun indeks modifikasi (Staging Area)..."
git add . > /dev/null 2>&1

show_cyber_loading "Mengenkripsi metadata commit..."
if [ -z "$CUSTOM_COMMIT" ]; then
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    COMMIT_MSG="[UPDATE-SISTEM] Auto-Push $TIMESTAMP"
else
    COMMIT_MSG="$CUSTOM_COMMIT"
fi

if ! git status --porcelain | grep -q "."; then
    write_cyber_warn "Tidak ada perubahan sistem yang terdeteksi untuk di-commit (Clear)"
else
    show_cyber_loading "Melakukan commit data..."
    git commit -m "$COMMIT_MSG" > /dev/null 2>&1
    write_cyber_success "Commit berhasil diterapkan: $COMMIT_MSG"
fi

show_cyber_loading "Mengkalibrasi uplink ke Node Utama (GitHub)..."
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    git branch -M "$BRANCH" > /dev/null 2>&1
elif [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    git branch -M "$BRANCH" > /dev/null 2>&1
fi

show_cyber_loading "Membangun terowongan aman (Secure Tunnel)..."
show_cyber_loading "Mentransmisikan file ke repositori (Push)..."

if git push -u origin "$BRANCH" --force > push.log 2>&1; then
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
read -p " [>] Tekan [ENTER] untuk menutup terminal"

