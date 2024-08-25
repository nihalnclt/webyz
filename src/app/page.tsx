import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      <div className="h-[70px] ">
        <div className="w-[1120px] max-w-[100%] h-full mx-auto flex items-center gap-4 justify-between">
          <h1>WEBYZ</h1>
          <div className="flex items-center gap-4">
            <span>Pricing</span>
            <span>Blog</span>
            <span>Docs</span>
          </div>
          <div>
            <button>Get Started</button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-70px)] flex flex-col justify-between items-center">
        <div>
          <h1 className="text-[40px] font-[700] text-center">
            Our SaaS Solution Will <br />
            revelutionize your work process
          </h1>
          <div className="flex items-center gap-4 justify-center mt-10">
            <button>Get Started</button>
            <Link href="/demo">
              <button>View Demo</button>
            </Link>
          </div>
        </div>
        <div>
          <img src="/images/mac_frame.jpg" alt="" className="w-[900px]" />
        </div>
      </div>

      <div className="bg-[#333] w-full h-[300px]"></div>

      <div className="mt-10 w-[1120px] max-w-[100%] mx-auto grid grid-cols-2 gap-10">
        <div>
          <div>
            <span>Benefits</span>
          </div>
          <h2>Track your sales in a new way</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam culpa quibusdam voluptates
            ullam ipsa accusamus amet? Nihil deleniti pariatur accusantium ducimus, sint nesciunt
            exercitationem et deserunt corporis placeat distinctio earum?
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
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-[#f9fbfd] mt-10">
        <div className="w-[1120px] max-w-[100%] mx-auto">
          <div>
            <span>Features</span>
          </div>
          <div className="flex items-start gap-4 justify-between">
            <h2>How technology is reshaping the workplace is discussed in the future of work</h2>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolor numquam,
              voluptatem reprehenderit natus vero ex eaque quisquam sint
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4 justify-center">
            <span>Data analysis</span>
            <span>Services</span>
            <span>Marketing</span>
            <span>Pricing</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-10">
            <div></div>
            <div>
              <h3>Hashdesk helps to drive business success with big data</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, ex molestiae enim
                voluptatibus aliquid soluta numquam eos nesciunt ipsam ad cum esse quasi tenetur,
                cupiditate autem excepturi labore error commodi.
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
        <h2 className="text-center">Traditional SaaS is outdated. Try Hashdesk</h2>
        <p className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos in impedit, dolorum adipisci
          esse eveniet debitis ullam, natus veritatis ipsa eum maiores perspiciatis.
        </p>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis, obcaecati.
            </span>
            <button>Learn More</button>
          </div>
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis, obcaecati.
            </span>
            <button>Learn More</button>
          </div>
          <div>
            <h4>Save Time, and icrease productivity</h4>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis, obcaecati.
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique ut eligendi
              officia illo eaque, magnam doloremque
            </span>
          </div>
          <button>Explore Integrations</button>
          <div></div>
        </div>
      </div>

      <div className="bg-[#333] w-full h-[300px] mt-10 flex flex-col items-center justify-center">
        <h4 className="text-white text-2xl font-[600]">Signup for your free 7 day trial now!</h4>
        <div>
          <button>Start for free</button>
          <button>Talk with Experts</button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center">
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
        <div className="border-t  ">
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
