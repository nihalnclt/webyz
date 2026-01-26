import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const customers = [
  { profile: "/images/customer1.jpg" },
  { profile: "/images/customer2.avif" },
  { profile: "/images/customer3.jpg" },
  { profile: "/images/customer4.jpg" },
  { profile: "/images/customer5.jpeg" },
];

export default function HomePage() {
  return (
    <div className="">
      <div className="h-[70px]">
        <div className="w-[1120px] max-w-[100%] h-full mx-auto flex items-center gap-4 justify-between">
          <Link href={`/`} className="flex items-center gap-2 text-lg">
            <img src="/images/logo.png" className="w-[20px] h-[20px]" />
            <span className="font-bold">Webyz</span>
          </Link>
          <div className="flex items-center gap-4">
            <span>Pricing</span>
            <span>Blog</span>
            <span>Docs</span>
          </div>
          <div>
            <button className="px-3 py-2 text-sm font-medium text-white bg-[#3AA6B9] rounded-md">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="bg-center bg-hero-pattern">
        <div className="w-[1120px] max-w-[100%] min-h-[calc(100vh-70px)] mx-auto flex flex-col justify-between items-center">
          <div className="text-center max-w-[700px]">
            <h1 className="text-[35px] font-[700]">
              Privacy-first{" "}
              <span className="text-[#3AA6B9]">
                Google Analytics alternative
              </span>{" "}
              for actionable insights.
            </h1>
            <div>
              <span className="text-sm text-[#8c8c8c]">
                A privacy-focused alternative to Google Analytics, offering
                streamlined, actionable insights without data compromise. Ideal
                for teams seeking simplicity and user privacy
              </span>
              <div className="flex items-center justify-center gap-4 mt-10">
                <button className="px-3 py-2 text-sm font-medium text-white bg-[#3AA6B9] rounded-md">
                  Get Started
                </button>
                <Link href="/demo">
                  <button className="px-3 py-2 text-sm font-medium border bg-white border-[#3AA6B9] text-[#3AA6B9] rounded-md">
                    View Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {customers.map(({ profile }, index) => {
                return (
                  <div
                    key={index}
                    className={
                      "w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full border-2 border-white " +
                      (index > 0 ? " ml-[-8px] " : "")
                    }
                  >
                    <img
                      src={profile}
                      alt=""
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                );
              })}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#eab308] text-base">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="text-xs">Trusted by 100+ Customers</span>
            </div>
          </div>
          <div>
            <img src="/images/mac-frame.jpg" alt="" className="w-[900px]" />
          </div>
        </div>
      </div>

      <div className="bg-[#282e3c] w-full py-10">
        <div className="container">
          <span className="text-[#747388] block text-center text-sm">
            Showcased on over 100 platforms
          </span>
          <div className="flex items-center justify-center gap-6 mt-6 opacity-70 filter invert">
            {Array(4)
              .fill(0)
              .map((_, index) => {
                return (
                  <img
                    src="/images/coursera-logo.svg"
                    alt=""
                    className="grayscale w-[100px]"
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      </div>

      <div className="mt-10 w-[1120px] max-w-[100%] mx-auto grid grid-cols-2 gap-10">
        <div>
          <div>
            <span>Benefits</span>
          </div>
          <h2>Track your sales in a new way</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam culpa
            quibusdam voluptates ullam ipsa accusamus amet? Nihil deleniti
            pariatur accusantium ducimus, sint nesciunt exercitationem et
            deserunt corporis placeat distinctio earum?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span></span>
              <span>Accessibility</span>
            </div>
            <div>
              <span></span>
              <span>Scalability</span>
            </div>
            <div>
              <span></span>
              <span>Cost effectiveness</span>
            </div>
            <div>
              <span></span>
              <span>Customization</span>
            </div>
          </div>
        </div>
        <div className="w-full p-10 bg-violet-500">
          <img
            src="https://cdn.corporatefinanceinstitute.com/assets/line-graph.jpg"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="bg-[#f9fbfd] mt-10">
        <div className="w-[1120px] max-w-[100%] mx-auto">
          <div>
            <span>Features</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h2>
              How technology is reshaping the workplace is discussed in the
              future of work
            </h2>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Recusandae dolor numquam, voluptatem reprehenderit natus vero ex
              eaque quisquam sint
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span>Data analysis</span>
            <span>Services</span>
            <span>Marketing</span>
            <span>Pricing</span>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-4">
            <div></div>
            <div>
              <h3>Hashdesk helps to drive business success with big data</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, ex
                molestiae enim voluptatibus aliquid soluta numquam eos nesciunt
                ipsam ad cum esse quasi tenetur, cupiditate autem excepturi
                labore error commodi.
              </p>
              <button>Get Started Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 w-[1120px] max-w-[100%] mx-auto">
        <div>
          <span>Benefits</span>
        </div>
        <h2 className="text-center">
          Traditional SaaS is outdated. Try Hashdesk
        </h2>
        <p className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos in
          impedit, dolorum adipisci esse eveniet debitis ullam, natus veritatis
          ipsa eum maiores perspiciatis.
        </p>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Veritatis, obcaecati.
            </span>
            <button>Learn More</button>
          </div>
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Veritatis, obcaecati.
            </span>
            <button>Learn More</button>
          </div>
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Veritatis, obcaecati.
            </span>
            <button>Learn More</button>
          </div>
        </div>
      </div>

      <div className="mt-10 w-[1120px] max-w-[100%] mx-auto">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <div>
              <span>INTEGRATION</span>
            </div>
            <h2>Integrate with your existing tech stack in seconds</h2>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Similique ut eligendi officia illo eaque, magnam doloremque
            </span>
          </div>
          <button>Explore Integrations</button>
          <div></div>
        </div>
      </div>

      <div className="bg-[#333] w-full h-[300px] mt-10 flex flex-col items-center justify-center">
        <h4 className="text-white text-2xl font-[600]">
          Signup for your free 7 day trial now!
        </h4>
        <div>
          <button>Start for free</button>
          <button>Talk with Experts</button>
        </div>
      </div>

      <div className="flex items-center justify-center mt-10">
        <span className="font-[600] text-lg">WEBYZ</span>
      </div>

      <div className="mt-10 border-t">
        <div className="w-[1120px] max-w-[100%] mx-auto grid grid-cols-4 gap-10">
          <div>
            <ul>
              <li>Platform</li>
              <li>Instigations</li>
              <li>Features</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Help Center</li>
              <li>Community</li>
              <li>Academy</li>
              <li>Legal</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Blog</li>
              <li>Docs</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>About Us</li>
              <li>Customers</li>
              <li>Careers</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="border-t ">
          <div className="w-[1120px] max-w-[100%] mx-auto flex items-center gap-4 justify-between">
            <div>
              <span>{new Date().getFullYear()}. All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-4">
              <FaTwitter />
              <FaInstagram />
              <FaLinkedin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
