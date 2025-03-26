'use strict';

// JSON 파일을 불러오는 함수
async function loadFolderFiles() {
    try {
        const response = await fetch('folderFiles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading folder files:', error);
        return {};
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const baseFolderPath = "https://app.yoons.com/mobile/vocanote/";
    const folderSelect = document.getElementById("folderSelect");
    const audioPlayer = document.getElementById("audioPlayer");
    const currentTrackLabel = document.getElementById("currentTrack");
    const audioList = document.getElementById("audioList");
    const playlistContainer = document.querySelector(".playlist");

    let folderFiles = await loadFolderFiles();
    let currentFolder = folderSelect.value;
    let audioFiles = [];
    let currentIndex = 0;

    const updatePlaylistView = () => {
        audioList.innerHTML = "";
        audioFiles.forEach((file, i) => {
            const li = document.createElement("li");
            li.textContent = file;
            li.addEventListener("click", () => playTrack(i));
            if (i === currentIndex) {
                li.classList.add("active");
            }
            audioList.appendChild(li);
        });
    };

    const playTrack = (index) => {
        if (index >= 0 && index < audioFiles.length) {
            currentIndex = index;
            const fileName = audioFiles[currentIndex];
            audioPlayer.src = `${baseFolderPath}${currentFolder}/${fileName}`;
            currentTrackLabel.textContent = `현재 재생 중: ${fileName}`;
            updatePlaylistView();
            audioPlayer.play();

            // 재생 목록 스크롤 위치 조정
            const liElement = audioList.children[currentIndex];
            if (liElement) {
                const liRect = liElement.getBoundingClientRect();
                const containerRect = playlistContainer.getBoundingClientRect();
                const liOffsetFromContainerTop = liRect.top - containerRect.top;
                const liHeight = liElement.offsetHeight;
                const desiredScrollTop = playlistContainer.scrollTop + (liOffsetFromContainerTop - 2 * liHeight);
                playlistContainer.scrollTo({
                    top: Math.max(desiredScrollTop, 0),
                    behavior: 'smooth'
                });
            }
        }
    };

    const playNextTrack = () => {
        if (currentIndex + 1 < audioFiles.length) {
            playTrack(currentIndex + 1);
        }
    };

    const changeFolder = () => {
        currentFolder = folderSelect.value;
        audioFiles = folderFiles[currentFolder] || [];
        currentIndex = 0;

        updatePlaylistView();
        playlistContainer.scrollTop = 0;

        if (audioFiles.length > 0) {
            const fileName = audioFiles[0];
            currentTrackLabel.textContent = `현재 재생 중: ${fileName}`;
            audioPlayer.src = `${baseFolderPath}${currentFolder}/${fileName}`;
        } else {
            currentTrackLabel.textContent = "현재 재생 중: 없음";
            audioPlayer.src = "";
        }
    };

    const initEventListeners = () => {
const playNextTrack = () => {
    // 아무것도 안 함 (연속재생 중지)
};        folderSelect.addEventListener("change", changeFolder);
    };

    const init = () => {
        initEventListeners();
        changeFolder();
    };

    init();
    console.log("[DEBUG] folderFiles", folderFiles);
});


//안내박스 추가부분
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('guideTooltip');
    const closeBtn = document.getElementById('closeTooltip');
    const folderSelect = document.getElementById('folderSelect');

    // 로컬스토리지에 저장된 안내박스 닫기 여부 체크
    const isTooltipClosed = localStorage.getItem('isTooltipClosed');

    // 로컬스토리지에 저장된 상태가 없다면 안내박스를 처음에 보이도록 설정
    if (isTooltipClosed === 'true') {
        tooltip.style.display = 'none';
    } else {
        tooltip.style.display = 'flex';
    }

    // 안내박스 닫기 버튼 이벤트 처리
    closeBtn.addEventListener('click', () => {
        tooltip.style.display = 'none';
        localStorage.setItem('isTooltipClosed', 'true');
    });

    // select 요소에 마우스오버 시 안내박스 보이기 (닫지 않은 경우만)
    folderSelect.addEventListener('mouseover', () => {
        if (localStorage.getItem('isTooltipClosed') !== 'true') {
            tooltip.style.display = 'flex';
        }
    });

    // 마우스가 select 요소를 벗어나면 안내박스 자동으로 숨기기
    folderSelect.addEventListener('mouseleave', () => {
        if (localStorage.getItem('isTooltipClosed') !== 'true') {
            tooltip.style.display = 'none';
        }
    });
});


