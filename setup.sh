#!/bin/bash
# 이 프로젝트의 Node.js 버전을 자동으로 설정하는 스크립트
source ~/.nvm/nvm.sh
nvm use
echo "Node.js 버전이 .nvmrc에 맞게 설정되었습니다: $(node --version)"
