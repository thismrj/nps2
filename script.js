const GOOGLE_APPS_URL = "https://script.google.com/macros/s/AKfycbxOaNRTOA40lgvzh8PQEcv_XE5TQj1uqzyK7_xJKaNcix3Z04n0klZA-ZpOayq-Q-j7/exec"
const REDIRECT_URL = "https://motozilla.com.ua/";
const COOKIE_NAME = "VotedOff";
const COOKIE_AGE = 864_000_000; // ~ 10 days;

const Slider = {
    consts: {
        INITIAL_SLIDE_SCROLL_TIMEOUT: 800,
        DEFAULT_SLIDE_SCROLL_TIMEOUT: 300,
        HIDE_CLASS: "hidden",
        SROLL_BEHAVIOR: "smooth"
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
    media: {
        critics: {
            0: ["screen and (max-width: 425px)", "r-425-fit"]
        }
    },
    next: function (behavior) {
        if (this.current.branch === undefined)
            return;

        const selector = this.branches[this.current.branch][this.current.index];

        document
            .querySelector(selector)
            .scrollIntoView({
                behavior: behavior ?? this.consts.SROLL_BEHAVIOR,
                block: "center",
                inline: "center"
            });

        this.applymedia(this.current.branch, this.current.index);

        this.current.index++;
    },
    applymedia: function (branch, index) {
        if (!this.media[branch] || !this.media[branch][index])
            return;

        const [mediaquery, cssclass] = this.media[this.current.branch][index];

        if (!window.matchMedia(mediaquery).matches)
            return;

        document
            .querySelector('form.card')
            .classList
            .add(cssclass);
    },
    update: function () {
        const { branch, index } = this.current;

        if (!branch || index - 1 < 0)
            return;

        const selector = this.branches[branch][index - 1];

        document
            .querySelector(selector)
            .scrollIntoView({
                behavior: "instant",
                block: "center",
                inline: "center"
            });
    },
    branch: function (chain_name) {
        this.current.branch = chain_name;
        document
            .querySelectorAll(this.branches[this.current.branch].join(","))
            .forEach(element => element.classList.remove(this.consts.HIDE_CLASS));
    },
    init: function ({ toBranch } = { toBranch: "__initial" }) {
        visualViewport.addEventListener("resize", () => this.update());

        if (toBranch) {
            this.branch(toBranch);
            this.next("instant");
        }
    },
    select: function (selector, event, func, { preventDefault = false, afterFn = undefined, once = false } = { preventDefault: false, afterFn: undefined, once: false }) {
        document.querySelectorAll(selector).forEach(_element => {
            _element.addEventListener(event, (_event) => {
                if (preventDefault)
                    _event.preventDefault();

                const handlerresult = func(_event, this);
                afterFn?.(handlerresult);

                setTimeout(() => Slider.next(), Slider.consts.INITIAL_SLIDE_SCROLL_TIMEOUT);
            }, { once })
        })
    }
}

const API = {
    send: (sender, score, feedback = undefined) => {
        const params = new URLSearchParams({
            $sender: sender,
            score,
            ...(feedback && { feedback })
        });

        return fetch(
            `${GOOGLE_APPS_URL}?${params}`, {
            mode: "cors",
            method: "GET"
        });
    }
}

const Cookie = {
    set: (name, value, maxage_ms, path = "/", samesite = 'None', secure = true) => {
        return document.cookie = [
            `${name}=${value}`,
            `Expires=${new Date(Date.now() + maxage_ms).toUTCString()}`,
            `path=${path}`,
            `Same-Site=${samesite}`,
            (secure ? "Secure" : ""),
        ].join(";");
    },
    get: (name) => {
        return document.cookie.split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1] || undefined;
    },
    erase: (name) => {
        return document.cookie = [
            `${name}="`,
            `Max-Age=-1`
        ].join("; ")
    }
}

const QueryParameters = {
    get: function (name, interpret_as = undefined) {
        const parameter = (
            this.
                __getQueryParams()
                .find(([key,]) => key == name)
        );

        if (!parameter)
            return;

        return interpret_as?.(parameter[1]) || parameter?.[1];
    },
    __getQueryParams: () => Array.from(new URLSearchParams(location.search).entries()),
}

function main() {
    const override_cookie = QueryParameters.get("override", Boolean);
    const coockie_lifetime = QueryParameters.get("c", Number.parseInt);

    AttachHendlers();

    if (Cookie.get(COOKIE_NAME) && !Cookie.get("90cb93")) {
        Cookie.erase(COOKIE_NAME);
    }
    
    Slider.init({
        toBranch: override_cookie ?? Cookie.get(COOKIE_NAME)
    });

    Slider.select(
        'input[name="score"]',
        'change',
        (event, slider) => {
            const score = Number.parseInt(event.target.value);
            const mode = QueryParameters.get("m", Number.parseInt) ?? 0;

            var branch = "";

            if (score < 7)
                branch = "critics"

            if (score > 8)
                branch = "promouters";

            if (score > 6 && score < 9)
                branch = "neutrals";

            if (mode !== 1 && score > 6)
                branch = "neutrals";

            slider
                .branch(branch);

            return ({ score, mode, branch });
        },
        {
            preventDefault: true,
            once: true,
            afterFn: ({ score, mode, branch }) => {
                API.send(`v2/m${mode}`, score);
                Cookie.set(COOKIE_NAME, "critics", coockie_lifetime ?? COOKIE_AGE);
                Cookie.set("90cb93", true, (coockie_lifetime ?? COOKIE_AGE))
            }
        }
    );
}

function AttachHendlers() {
    visualViewport.addEventListener("resize", () => {
        if (isMobileDevice()) {
            document.querySelector('.mail-desktop').setAttribute("style", "display: none");
            document.querySelector('.mail-mobile').removeAttribute("style");
        } else {
            document.querySelector('.mail-desktop').removeAttribute("style");
            document.querySelector('.mail-mobile').setAttribute("style", "display: none");
        }
    });

    visualViewport.dispatchEvent(new Event('resize'));

    document.querySelector(".mail-desktop > svg").addEventListener('click', () => {
        const text_box = document.querySelector(".mail-desktop > .text");
        const copy_msg = document.querySelector(".mail-desktop > .copy-msg");

        navigator.clipboard.writeText(text_box.innerText);

        text_box.setAttribute("style", "color: transparent");
        copy_msg.setAttribute("style", "visibility: visible");

        setTimeout(() => {
            text_box.removeAttribute("style");
            copy_msg.removeAttribute("style");
        }, 2000);
    });
}

function isMobileDevice(userAgent = navigator.userAgent || navigator.vendor || window.opera) {
    const var1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    const var2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

    return var1.test(userAgent) || var2.test(userAgent);
}

document.addEventListener("DOMContentLoaded", main);