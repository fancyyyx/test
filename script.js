document.addEventListener("DOMContentLoaded", () => {
    // 检查是否已有玩家信息
    if (!localStorage.getItem('playerID') || !localStorage.getItem('playerName')) {
        // 显示弹窗让玩家输入ID和名称
        let playerID = prompt("请输入您的玩家ID:");
        let playerName = prompt("请输入您的玩家名称:");
        localStorage.setItem('playerID', playerID);
        localStorage.setItem('playerName', playerName);
    }

    // 显示玩家信息
    document.getElementById('player-id').innerText = localStorage.getItem('playerID');
    document.getElementById('player-name').innerText = localStorage.getItem('playerName');
    displayGameHistory();

    // 折叠功能
    document.getElementById('player-info-button').addEventListener('click', () => {
        toggleVisibility('player-info');
    });

    document.getElementById('adventure-history-button').addEventListener('click', () => {
        toggleVisibility('adventure-history');
    });

    // 清除历史记录功能
    document.getElementById('clear-history-button').addEventListener('click', () => {
        localStorage.removeItem('gameHistory');
        displayGameHistory();
        alert("历史记录已清除！");
    });

    // 冒险笔记按钮点击事件
    document.getElementById('adventure-note-button').addEventListener('click', toggleAdventureNote);
});

// 切换显示隐藏
function toggleVisibility(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// 切换冒险笔记弹窗显示
function toggleAdventureNote() {
    const notePopup = document.getElementById("adventure-note-popup");
    if (notePopup.classList.contains('hidden')) {
        loadAdventureNote();
        notePopup.classList.remove('hidden');
    } else {
        notePopup.classList.add('hidden');
    }
}

// 加载冒险笔记
async function loadAdventureNote() {
    try {
        console.log("开始加载冒险笔记...");
        const response = await fetch('elements.txt');
        if (!response.ok) {
            throw new Error('网络响应错误：' + response.status);
        }
        const data = await response.text();
        const formattedData = data.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        document.getElementById("note-content").innerHTML = formattedData;
        console.log("冒险笔记加载成功");
    } catch (error) {
        console.error('加载冒险笔记时出错:', error);
        document.getElementById("note-content").textContent = '加载笔记时出错，请稍后重试。';
    }
}

// 游戏步骤模拟
class TreasureMap {
    static async getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }

    static async decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.2) {
                    reject(new Error("解码失败!请再试一次..."));
                } else {
                    resolve("解码成功!宝藏在一座古老的神庙中...");
                }
            }, 1500);
        });
    }

    static async encounterMysticalCreature() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.3) {
                    reject(new Error("神秘生物不高兴了，它把你吓跑了！"));
                } else {
                    resolve("你遇到了一只神秘生物，它指引你找到了宝藏的线索!");
                }
            }, 2000);
        });
    }

    static async searchTemple(hasArtifacts) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (hasArtifacts) {
                    resolve("你用古老神器击败了神庙守卫，成功找到了宝藏!");
                } else {
                    if (random < 0.7) {
                        reject(new Error("糟糕!由于你没有获得神器，而且运气不好遇到了神庙守卫!你被他杀死了！"));
                    } else {
                        resolve("找到了传说中的宝藏!");
                    }
                }
            }, 2000);
        });
    }

    static async collectAncientArtifacts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("你收集了一些古老的神器，它们会帮助你在冒险中!");
            }, 1500);
        });
    }
}

// 保存游戏历史
function saveGameHistory(stepDescription) {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    gameHistory.push(stepDescription);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    displayGameHistory();
}

// 显示游戏历史
function displayGameHistory() {
    const historyElement = document.getElementById("game-history");
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    historyElement.innerHTML = gameHistory.map((entry, index) => `<p>${index + 1}. ${entry}</p>`).join('');
}

// 寻找宝藏
async function findTreasure() {
    let hasArtifacts = false; 

    try {
        let clue = await TreasureMap.getInitialClue();
        displayStep("step1", clue, "images/library.jpg");
        saveGameHistory(clue);
        await sleep(2000);

        let location = await TreasureMap.decodeAncientScript(clue);
        displayStep("step2", location, "images/temple.jpg");
        saveGameHistory(location);
        await sleep(2000);

        let creatureEncounter = await TreasureMap.encounterMysticalCreature();
        displayStep("step3", creatureEncounter, "images/mystical_creature.jpg");
        saveGameHistory(creatureEncounter);
        await sleep(2000);

        const artifactChance = Math.random();
        if (artifactChance < 0.5) {
            hasArtifacts = true;
            let artifacts = await TreasureMap.collectAncientArtifacts();
            displayStep("step4", artifacts, "images/artifacts.jpg");
            saveGameHistory(artifacts);
            await sleep(2000);
        } else {
            const noArtifactsMessage = "你没有获得古老的神器，继续前进吧!";
            displayStep("step4", noArtifactsMessage, "images/no_artifacts.jpg");
            saveGameHistory(noArtifactsMessage);
            await sleep(2000);
        }

        let result = await TreasureMap.searchTemple(hasArtifacts);
        displayStep("step5", result, "images/treasure.jpg");
        saveGameHistory(result);
        await sleep(2000);

        document.getElementById("result").innerText = "恭喜你！你成功找到了宝藏！";
        document.getElementById("result").style.display = "block";
        document.getElementById("restart-button").classList.remove("hidden");
    } catch (error) {
        handleTreasureError(error);
    }
}

// 处理错误
function handleTreasureError(error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    if (!document.getElementById("result").innerText) {
        hideSteps();
        document.getElementById("result").innerText = errorMessage;
        saveGameHistory(errorMessage);
        document.getElementById("result").style.display = "block";
        document.getElementById("restart-button").classList.remove("hidden");

        if (errorMessage.includes("神庙守卫")) {
            displayStep("step5", errorMessage, "images/guard.jpg");
        }
    }
}

// 隐藏步骤
function hideSteps() {
    const steps = document.querySelectorAll("#steps > div");
    steps.forEach(step => {
        step.style.display = "none";
    });
}

// 显示步骤
function displayStep(stepId, message, imageSrc) {
    hideSteps(); // 先隐藏所有步骤
    const stepElement = document.getElementById(stepId);
    const imgElement = stepElement.querySelector("img");
    const textElement = stepElement.querySelector(".step-text");

    imgElement.src = imageSrc;
    imgElement.alt = message;
    imgElement.style.width = "600px"; // 设置图片宽度
    imgElement.style.height = "auto"; // 设置图片高度自动调整

    textElement.innerText = message;

    stepElement.style.display = "block";
}

// 睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 启动游戏
document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("steps").style.display = "block";
    findTreasure();
    document.getElementById("start-button").classList.add("hidden");
});

// 重新启动按钮
document.getElementById("restart-button").addEventListener("click", () => {
    location.reload();
});

// 背景音乐播放控制
const bgMusic = document.getElementById("bg-music");
document.getElementById("play-music-button").addEventListener("click", () => {
    bgMusic.play();
});
document.getElementById("stop-music-button").addEventListener("click", () => {
    bgMusic.pause();
    bgMusic.currentTime = 0;
});

// 冒险笔记
document.getElementById("adventure-note-button").addEventListener("click", toggleAdventureNote);

// 关闭冒险笔记小框
document.getElementById("close-button").addEventListener("click", () => {
    document.getElementById("adventure-note-popup").classList.add("hidden");
});
