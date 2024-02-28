const Slider = {
    actions: {
        next: ".btn"
    },
    current: {
        branch: undefined,
        index: 0
    },
    branches: {
        __initial: "#score",
        critics: ["#critics",],
        neutrals: ["#neutrals",],
        promouters: ["#promouters"],
    },
    next: function () {
        if (this.current.branch === undefined)
            return;

        const selector = this.branches[this.current.branch][this.current.index];

        document
            .querySelector(selector)
            .scrollIntoView({ behavior: "smooth" });

        this.current.index++;
    },
    update: function () {
        const { branch, index } = this.current;

        if (index - 1 < 0) return;

        const selector = this.branches[branch][index - 1];

        document
            .querySelector(selector)
            .scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
    },
    branch: function (chain_name) {
        this.current.branch = chain_name;
        document
            .querySelectorAll(this.branches[this.current.branch].join(","))
            .forEach(element => element.classList.remove('hidden'));
    },
    init: function () {
        visualViewport.addEventListener("resize", () => this.update());
        document.querySelectorAll(this.actions.next)
            .forEach(btn => btn.addEventListener("click", () => this.next()));
    }
}

function main() {
    

    Slider.init();

    AddEventListeners('input', "change", (e) => {
        e.preventDefault();

        const score = Number(e.target.value);

        if (score < 7)
            Slider.branch("critics");
        if (score > 8)
            Slider.branch("promouters");
        if (score > 6 && score < 9)
            Slider.branch("neutrals");


        setTimeout(() => Slider.next(), 800);
    }, { once: true });

    window.addEventListener("resize", resize)
    window.dispatchEvent(new Event('resize'))

    document.querySelectorAll(".mail-desktop > svg")[0].addEventListener('click', () => {
        const text_box = document.querySelectorAll(".mail-desktop > .text")[0];
        const copy_msg = document.querySelectorAll(".mail-desktop > .copy-msg")[0];

        navigator.clipboard.writeText(text_box.innerText);

        text_box.classList.add("a88f05b6")
        copy_msg.classList.add("cd42a41s")

        setTimeout(() => {
            text_box.classList.remove("a88f05b6")
            copy_msg.classList.remove("cd42a41s")
        }, 2000);

    })


}

window.isMobile = function(a = navigator.userAgent || navigator.vendor || window.opera) {
    const var1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a);
    const var2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a);

    return var1 || var2;
  };

function resize() {
    if (window.isMobile()) {
        document.querySelector('.mail-desktop').setAttribute("style", "display: none");
        document.querySelector('.mail-mobile').removeAttribute("style");
    } else {
        document.querySelector('.mail-desktop').removeAttribute("style");
        document.querySelector('.mail-mobile').setAttribute("style", "display: none");
    }
}

function AddEventListeners(selector, event, func) {
    return document.querySelectorAll(selector).forEach(el => el.addEventListener(event, func))
}

document.addEventListener("DOMContentLoaded", main);