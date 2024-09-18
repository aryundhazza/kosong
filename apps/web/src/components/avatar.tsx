'use client';

import { deleteToken, getToken, getUserId } from '@/lib/server';
import { useAppSelector } from '@/redux/hook';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/user';

interface EventType {
  points?: string;
  referralCode?: string;
  email?: string;
  sex?: string;
  dateOfBirth?: string;
  id?: string;
  name?: string;
  date?: string;
  avatar?: string;
}

export default function AvatarComp() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };
  const user = useAppSelector((state) => state.user);
  const [profile, setProfile] = useState<EventType | null>(null);

  const onLogout = async () => {
    await deleteToken();
    setToken('');
    router.push('/login');
    router.refresh();
  };
  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      const response = await getProfile(userId, token);
      setProfile(response.result.user);
      console.log(response); // Ensure the response is as expected
    } catch (err) {
      console.error(err); // Handle errors
    }
  };

  useEffect(() => {
    getData();
    fetchProfile();
  }, []);

  return (
    <div>
      {token ? (
        // <div onClick={onLogout} className="cursor-pointer">Log Out</div>
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => router.push('/profile')}
        >
          {/* <!-- Profile dropdown --> */}
          <div className="relative ml-3">
            <div>
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    profile?.avatar ||
                    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw8PDxAPDw0OEA8PDhEVEA8PEBYQFRUWFhUYFhUYHSggGBolHRUYIT0hJSorLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGislHyUtLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAAAQQGAgMFB//EAEMQAAEDAgEICAMGBAUEAwAAAAEAAgMEESEFBhIxQVFhgRMUIjJxkaGxUsHRBxUjQlSSFmKC8DNyg6LSJGNzsjRDU//EABsBAQACAwEBAAAAAAAAAAAAAAABAgMEBQYH/8QALhEAAgICAQMDAwMEAwEAAAAAAAECAwQRMQUSIRNBURQiYTJCUhUjcYEkQ5Ez/9oADAMBAAIRAxEAPwD2JAZR6x4hATUBrn7p5e6AiIDbTd7l9EBKQEeq2c/kgNCA59ZnRRUoIkmaXg9xn4j/ACGpZoY9k+EY5WwjyytV32ljVT05P80jg3/a2/utqOA/3M1pZa9kV+rz3r5CbPZFfYxjfd1ytiOHWvYwyyZs50uXax/eqZj/AFlvssqorXCMTuk/cjurpzrmlPjI8/NZFXH4MTnL5BlbMNUso/1H/VOyPwV738kmLLNWzu1Ew/1HH3VHTW+USrprhnRpc8a+Mj8USAbHsafUWKxyxKn7F1mWx9zv0P2jOwE8AI2mN1j+131WvLA/izNHqP8AJFio87qKobYS9G827Mg6M+eo+a1Z4tkOUbdeZVP3OkDfEajqWu9o2U9o3U3e5fRCSUgI9Vs5/JAaEBJpdR8fogNyAhz948vZAYIAQGWgdx8igGxpBBINrjYUBK6Ru8eYQGEzgWkAgnDAYlAR9A7j5FAbIBY44C23BAbjI3ePMICpZx570sHYiIqJhcWaR0YPF/yC26sSc/L8GCd8Y+Eef5Wznq6q4fIWRn/62dhvMjE8yuhXjwh7GnO6Ujj2WcwbMrIV2AQq2ZWUldjAQq2OyFdjAQrsdkK7MrIVbHZCrZ0cmZZqaY/hSuDdrD2mHkfksVlEJ8oy15NlfDLtkHPeF5DagdC8i2ne8Z8drVzrcOUfMfJ1KOpQl4n4LlHOxwDg5pBxBDgQRwK0tNcnSUk/KZrqMbWxtfVihJq0DuPkUBvgNhY4G+3BAbOkbvHmEBGlBLiQCRvGIQGOgdx8igDQO4+RQE1AYyd0+BQEJAZwd4c/ZATEBy8vZXgpYukmeGi/Zbre42ODRtWSut2PSKTmorbPK84c7J6u7G3hp9Wg09pw/ncNfhqXUpxYw8vk0bL3Lgr4C2jX2MBCrYwEK7GApKbMgEI2OyFWxgIVbHZCux2QpsdkK7MgEIbGAhRsdlJXYwEK7OrkbLk9Iew7Sjv2o3Elp8PhPgsFuPCxfk2aM2yl+OD0nNzLkNU0lh0ZABpRnvDXq3jiuRdRKt+eD0GNlwvXjn4O2sJtkWp73L6oDUgJcHdHP3QGxACA19M3f6FAJ0rSCAcSLDA60Bo6F271CAyYwtIJFgEBx86M6YaFn/6VDx+HHiP6nbmrPRjysf4MNtqgjyTKmUZqqQyzvL3nVr0QNzRsC7FdcYLUTnTscntkUBXMbYwFJVsYCFWx2QrsyQrsYCFWx2Qq2OyFWx2QrsYCFdjshVsdkKtmQCkq2OyFdjshXYwEKtm6nmfG5r43Fj2m7XA2KiUVJaZMLJQl3Remej5rZ1NqLRTEMqAMNei/DWNx4Lj5GK63uPB6PB6jG5ds+SwSjSN24i1t3utQ6ph0Lt3qEBujeGixwI1oDLpm7/QoA6Zu/wBCgIiAyj1jxCAmoCu54ZxsoorYOqJB+Ezni53Aeqz49Ltf4MNtqgjx+rqZJnukkcXyPN3E/wB+i7MYqK0jmSm5PbNdlYpsdkKNjAUkbGhVsdkK7MgEKbGhVsYCFWx2Qq2MBCuxhCux2UldmQCENjAQq2MBCmx2QrsYCFWzKyFWzJpIIIJBBuCMCCjW+SFJxe1yejZn5xdO3oZSBUNxB+No2+K4+VjOD7lwep6b1BXLsn+pFqWmdchz948vZAYIAQG3q7uHqgGISMTawx8kBDy3luKlhfM+/Zwa3C7nnUAslVTsekUsmoLbPGMp5QkqpnzSm73nkBsaOAXbrrUI9qOROxze2RrK5j2OykrsdkKtjCFWxgIVbMghXYAIV2NCrZLp8nTyC7IZXjeI3kedlR2QXLRZVzfCZnLkupYLvgmaN5jfb2RWwfuRKqxcxZFCuYWOykpsdkKtmQCFdjAQrsdkKtjshXYwEKtmQCFWxgKSjZnDI5jg9pLXNILSNYIUSipLTJhY4SUo8nqGbuXW1MVzhMywlaLa944FcLIodctex7Tp+asmvfudMxl3aFrHesB0BdXdw9UAdXdw9UBKQGEp7LvA+yA8bzxy31uchp/6eElsY2E6nO528l2sansjv3OTk3d8tLg4Nlsmq2ZWQjYWQrsyAQq2MIVbHZCrY7IV2dXIOQpq1+jGNFjf8SQjst+p4LDdfGpeeTNRjyufjguRiyXkoAPAmqgOEkl/DUxaCd+Rx4R0H9Pirz5ZCn+0KS9oqdjW7NJ5J8hYBZVgL9zMEuqv9sTGH7Qpr9uCJzdtnOafW6l4EfZlV1aX7onRjrcl5T7ErBDOe6TaN9+Dxg7wPksLhfR5XlGdWY2V4ktMrOcWbUtGdL/EgJsJANR3OGzxW5Rkxs8Pwzm5mFOjyvKOLZbRz9jAQq2MIVbHZCjY7IVbHZCrYwFJVsyAQq2OyFdk7I+UHU0zZG6tT272bQsN1Ssjpm1h5Use1S9vc9WoZmvjY9pBa4XB4FcGUXF6Z72uxWRUl7khQXBAR+s8PVAVbP8Ay70NN0LMJai7NeIj/MflzW3iVd89v2NXKt7Y6XueWALsHIbHZCrYwEI2ZWQpsYCFWx2QrsdkK7JmSsnvqZmQs7zza+uzdZJ8FSyxQj3MvVW7JKKLznDlVmTYWUdIAJS25drLWn8x3uJXOoqd8++fB1cq+ONBVw5PP3OLiXOJc4m5JJJJ4ldRJJeDhSk29sLKSmx2QrsYCEbLxmjl4TDqVXZ4e0tjc7G4+B2/gVzMmjsfqQOzg5isXo2/6K9nFkg0k7o8TG7tRO3t3eI1Lcx7vUhv3Obm47os17HMCzmi2OyFWxgIV2MBSVbMgEK7HZCrYwEKtjQrsFALnmLlawdTOxtd8WOy93DzN1zM2nz3o9R0LM2nTJ/4Lf1nh6rnHpQ6zw9UBoQPweQ505S61VSPBvG09HH/AJW4X5m55ruY9fZA4eRb3TOUs5r7GAhVsyshXY7IU2MBCGxgIUbGAhGy9fZxStY2oq36mfhg7gAHO9wudnSbagdbpsFGMrGVCvq3TyyTP70ji48BsHIWC3q4KEVFHJut9SbkzQAshg2MBCuxoQ2MBCrZmxxaQ5ps5pDmncRiFDSaaIU3FpovWc9qvJ0FWB22aLj4HsvHn7LmY/8AbucDv5yV+JG1coo1l1TzWx2QhsYCFNjAQrsyAQq2NCNghAIQCgk3UVU6GRkrdbHB3iNo5hY7IqUXE2Ma51WKaPUoJQ9rXtxa9ocPArgyj2vR9BqsVkFJGaqZDnZ31QpqKZ4JD3Doo/8AM/D6nks+PHvsSMGTPsrbPHgF3DgtjshRsYCFWzJCuxgIV2MBCrY7IV2MBSVbL9kAaORakjWRUX8rewXLu85C2dvGesOTRQwF1DgNmVkK7HZCrY7IVbGAhVsysiKtl3yZjkSYHYJ7fuJ91y7PGSj0VHnp0t/kpQC6p5lsdkKtjAQrsyshXYIQCEAoJBBoSAEJL/mJUCWnMZJ0oHW/odct+Y5Lj5kO2e/k9j0S/vp7Xyiy9AOPotM7ZRPtSrP/AI8A1dqZ3j3W+7l0cCHMjl9RnxEoS6Rymx2Qq2MBCrZlZCuxoU2MBSQ2MBCuxgIV2XzMMiakqqUnElxH+V7be4K5eWu2xTO301+pTKtlIfG5pLXCzmktcNxBsV04tSW0cKacXpiAUmNsYCFWxgIVbGpK7HZRwV2XrKDOq5HZEcHyAAjbd7tN3pdcuv8AuZGz0mR/x+nqL5ZSAF1TyzY7IV2NCNghAKCRIAQCQAoJEgLHmHVaFXobJmFvNuI+a0s2O4bO10S3sv7fk9IXJ2j2Hk8iz5qTJXS436MMjHIXPq4rtYkdVo4WdPdrOCAtk0tjAQo2ZBCrY7KSuxhCNjshRsYCFdjAQhs6+bOVOqVDZD/hu7Eo/lO3kcVr5FXqQ/Js4WV6Nm3wdvPfIna65CNKKSxl0cbHY7wIWviX/wDXI3ep4n/dX5T5KiAugcJsaFWxgKSux2QrssOaWRDUSiR4/AiNydjnDU0LTy71CPauWdXpeE7rO+X6UZ55ZVE83RsN4oLtB2F/5jy1eajDpcI9z5ZHV8xW2dkeEV9bpxWwQgFBIIBIBISCgCQAhIKASsk1HR1ELxhoyM8ibH0Kx3R3Bo2cOfZfGX5PWOmO/wBAuJ2HufqEeN5ak06qodvlk9yPku5StQSPP5EtzbIdlkMDYwEKtmQCkq2OyFdjshXYwEKtjshVsdkKtjshVss+bGc3QDoJwX0xwB1ll9ltreC0snF7vuhydXB6l6a9O3zE6WUc0Ypx01FIwNdjoXvH/S78vgsNeZKv7bEbOR0uFy78eX+ivVGbtZGbGB54ts8ei3I5VT9zk2dOyYPzAUOQat5AFPLzGiPVS8ipfuKR6fkyelBneyZmbb8SrkaxgxLAf/Z+zktS3N34rR08fovb9+Q9L4Fl7ORgZ1aiAbGBol4Fhbcz6qaMVt99hTO6pCMPRx+Pkqa6J51vYKACARQAgEoJBAJACgkSAEJAG2O7FRLgtB6kmX375G9c/wBE731p51Um73ne958yukuDDJ7ZgAhj2MKSrZlZCuxoV2OyFdjAQq2OyFdmVkK7HZCuyRR0UsxtFG+Q8BceeoKk7Iw5ZkrpsteoRbOm+gr6ECS0kTTiS14c3wcASPNYfUou8cm1KjMxPuW0vwTIM86tos7on8S0g+hVHg1vgyw65kR8PTM5c9apwwbEzjouJ9SoWBWuRLr2Q+EkcmqrqmqcGvfJK46mC+jyaMFnjXXUt6NCeRkZUtNt/g31OblZG3SMLiNZ0S15HiAbqFlVSeky9nS8qC24eDlOaQbEEEawRYrMpJ8GjKEovTQipKiQCUAEJEgBCQQCUAEJEgC6glG/rblXtL+oyFM2znDc5w9VkXB0peGY2UlNmQCFWx2QrsdkKtjshXYwhRsYCEbOhkjI89U60TeyMHPODB4naeAWK2+FXJs42HbkPUF4+S1xZv0FE0PrJBI/WGnBv9LBiea0HkXXPUEdqOBiYi7r3tmqsz0awaFJC1oGAc4WHJjVaGC35sZgu65GC1RE05OzzlBIqGNlYdrQGuA8NRCvZgx/Y/Jio65NeLltExzsj1HaOjE46+9Eb8dixf8AJr8cmy5dMyPL8P8A8F92ZHZiZg7h01/QJ6uS/Yr9L0yPnv3/ALG/OOhpQW0kOk7eG6A5uOJRY11j3Nky6niY61RHbOZDnnVh5Luie0/k0SABwN7+d1neDXrRpQ67kKW3rXwdRmcFBVjRqohG44aThccnjEc1gePdV5g9m9HqGHlfbdHTIuU8zrt6Skk6RpxDCQbj+V23mr15unqxGDJ6Kmu/He18FTmjcxxY4Fr2mzmnAgrfjJSW0cCdcoPtktM1qSgJsnQIBKACEiQCugBQAQkz6IqNk9o8px6M87fhlkH+4pU9wTOrkLtsaIwWQ19jAQq2ZWQq2NCuxqSux2Qq2dvNjIZq5DpXEEdjIdVzsaFq5OR6S8cnR6dhPJnt/pR3MuZyNgHVqINaGdlzwBotI1hu88StanFdn32G/m9TjQvRx/b3KdK9z3FzyXPdrcTcnmulGKitI85ZZKcu6T2xKTECAFABAJAJACgkn5JytNSu0ondm/aYcWHl81htojYtM3MXNtx5bg/HwW6qp4cq03TRAMqWC1todta7eDsK58ZSx59r4PQ2119Ro74fqRSqaglll6FjSZblpbqsRrvuAXRlbGMe58HnK8Wyyz04ryZ5UyZLSv0JQASLtIJLSOBUV3RsW0Tk4lmPLViIRWU1gQCQCUAEAISJVlwWgttIuX3ItX1jrfSHCztp9CtnwtpFrx4OA+d1nxZbqRfqEOy9nIAWwc7ZkAhDY0KNjCkjYwEKtjsjK78l7rH9QyYxjOzNMACduk7Fx5C65MF617b4R6e6X0WCorllHsuseVbYIVBQAQCugBAJQSCASEgoB280KqWOrYIml4k7MrRq0N53W1+m1a2XGLhtnV6TdZC9KC2nyXDLeUKeh05WsaamfYO862AJ3NwXPprnb49j0OZk04ac0vuZAyblGHKcRp6kNbOBdpGFyPzM48FksrlRLujwatGVV1Ct12+JFQyxkuSllMcgw1sdbsuG8fRb9VsbFtHAy8OePPtlx8kAlZTTEgBAJQSCA35PhMk0TB+eRjf9wVLHqLZsY0O+2K/J650P8p8iuR3ntfp0Uv7R6S0sMux7Cw+LTceh9FvYE9pxOP1qvUozRULLoHBbHZSRsyAQo2OyFdjAQq2SKGLTliZ8csbfNwCx2PUGzLjrutivyi0faHL26ePY1j3eZAHsVpYC/Uztdfl5hD8FRXQPOggEgBAJQAQkSAEJBQDfQ0ck8jY426T3eQG8nYFSc4wW2Z6Med01CBfqFtJktsbJHjppiA99sfE/CwLlWSsvba4PWURx+nxUZP7mcPPPIsjXuqmuMsL7F20s3f0+11s4ty12Pk5fVsKfd68XtM4eRaCaeZrYLtc0hxkF7MG+/wAtq2b5xhH7jnYWPbbavT/9LdnxXRNgFO+0tQdEg4Attrcd193FaGJCTn3Lg73V7640+nLzIoK6h5UFBAroSJACEnfzHpekrWH8sTXSHxtYe61cuWoHV6PT35Cfweorkdp7LZXs9aZs1I8jF8JErcDewvpehK2sSfbYjndUp9Sh/g80su4eMbHZCrYwEKtjshXY0K7J+QW3qqcf91h8jf5LDkP+2zc6et5EF+TrZ/u/6po3RN9SVr4P6GdDrz/vpfgrS3ThiQCUAEJEgBACEiUA30NHJPI2OJuk9x5AbSdwCpZYoLbM9FE7pqEEXdzoMkQWFpKqQc3EezRdc378mX4PTN09Nq0vM2Uesq3zPdJI4ue43J9gNwXShBQWkeZuundNyk/Ja8x8qyvcaV7TLDokgnHQG43/ACnctHLqivvXhne6RlWT/syW4k/K+UafJkZhpmNE8l3W16N9rj7BYqq53vcuDay8mnBg4VL7mUCaZz3Oe9xc9xu5xNySuml2rSPK2TlOTlJ+TWpKCQAgBQSJCUX77O6UMilndrlcGNw/Ky/zPoubmT3JRPU9Do7a3Y/cuHTN3+hWmd0iOaCCDiCCCOBReHsicVJNM8typRGCaSI/kd2eLTi30IXfps74Jngsyl03SiyMAspp7GhXYIAUEHSzaxrKf/yD2KwZX/zZ0Omr/kw/yWrObNueqn6WN0YboNbZxcDgTuHFaONlRrj2s73Uul25NvfFrg5P8EVXxw/uf9Fn+vh8HP8A6Bf8oX8EVXxw+b/on18Phj+gX/KA5j1Xxw+b/on18Pgn+gX/ACg/geq+OHzf9E+vh8D+g3/KEcx6r44fN/0UfXQ+B/Qb/lB/A1V8cPm//in10Pgn+g3/ACg/gaq+OHzf9E+ugP6Df8oP4Gqvjh/c/wD4p9dD4H9Bv+UdZ5gyRBYWkqpBzcfkwLX+7Jn+DoP0um0+PM2Uatq5JnulkdpPccTw2AcAulCCgtI81ddO6bnPk3ZJyZJVSiKMY63OPda3eVS21Vx2zJi4s8ifbH/ZccoV0GSoRBAA6pcLknE3OGk/6LQhCV8u6XB6C++rp9Xp1/qKJNM57i97i57jdzibkldKKUfCPMTslOXdLk1qSgkAKCRIAQkzhjc9zWNF3PcGtHEmwVZPS2Xrg5yUV7nrOT6UQxRxN1RtDee0+a4tku6TZ73HqVVaiiQqGc29Xdw9UBVs+MkksbUNAJj7MlvgOo8j7rfwrtPtZ57rmJ3R9WPK5KQuseTYKCAQkRQGTHlpDmkhzSCCDYgjaCoaT8MtGTi9rkm/fdV+om/eVi9Cv+KNv6/I/mxffdX+om/eVHoV/wAUT9fkfzYfflX+om/eU9Cv+KH1+R/Nh991f6ib95T0K/hD6/I/mxfflX+om/eU9Cv4Q+vyP5sPvyr/AFE37ynoV/xQ+vyP5sPvyr/UTfvKj0K/hE/X5H82L78q/wBRN+8p6Ffwh9fkfzZbMyKieQTTzSyPjYNFoc4kXHacfKw81o5cYpqMV5O70i22UZWWSbSNkzabK8JLPw6mO+je2kN197SqRc8eXngzWKnqVb7f1IqNLkKokqDTaBbI0/iE30Wt+K+0bt635ZEFDuOBX0+6d3pNf5LXlCuhyVB1eAB1S8XJNjj8b/kFowhK+XdLg7l19XT6vTr/AFFDnlc9znvJc9xu5x1krpxSitI8vZZKcnKT8s1qSgIBKCQQCTZIKAWzMLJJkldUEdiLssvtkO3kPdaWXbpdqO90XE7p+pLhF+6ueHqucepDq7uHqgJSA1VMbXse1wu1zXAjeCMVKbT2ilkFOLi/c8oyzk91NM6M93vRnew/3Zd2i31IbPBZ2LLHtcXx7EFZjSEgFdQAUkiUAEJBAJQAQkSAV0AFQSelU+SZW5NFPFotmkb+ISSLaeL+djZceVqd3cz2dWJNYfpw8NkTJebLKJzZ5arQLNdi2NltoJdrCyWZDt+2MTXxumwxX6k7DZlvO+CNjhTOEkxwDgOyOJO3wVasWcn93BfL6vTCLVXmR59NM57nPe4ue4kucdZK6iiorSPK2TlOXdJ+TWpMYlBIIAQkSAFAN1FSvmkbEwXe86I3cSeAVJyUVtmamqVs1CPuewZGoWU8EcTNTAcd5JJJPiVx7Jucts91jURprUETlQzggI/WeHqgDpr4W14a96A5WcWQhUxWBHSsuYjbbtB4FbGPc65fg53UcJZNf5XB5nLG5jnNcC1zSWuB1gjWu2pKS2jw84OEnGXJghTQkAIAQkSgAgEhIkAKACALqCU9HaqM7K17Q3pQwAWuxoaTzWusWtPejpT6tkyj271/g48073m73Oed7nFx9VmUUuDRnbOfmTbNasUBAJACgkSAFABCRJsnR6PmZm6YGdNKLTyjAEYsZu8SuXk3dz0uD1nSsH0Y98uWWbpdDs2vbbq4rVOyHWeHqgDrPD1QGhAZR6x4hATCgKrnhm70wM8LfxmjtNFu2PqFu4uR2vtlwcLqvTfVXqQXk8+I/vUusntHkmmnpiQgSgAgEhIXQCuoAIAUASEggEgBQSJACEiQAoAIBISCBF1zJza0y2qnb2QbwsI1n4yN24LQyb/2xPRdL6dv+7Yv8F/stA9IRJ+8eXsgMEAICT1cbz6IAMIGIvcY7NiA19Ydw9UA2yF3ZNrHdr3oCtZ0ZqiW81OLTa3swAfxH83ut3Hyu37ZcHC6l0pW/wByrn4+SgvaWkgggg2IOBB4hdRNPg8pKLi9PkxUlRIBKACAEAlBIFAJACEiUAEJEgBACgCQkEArqH4JSLrmnmiXls9U0hvejiOs7i/hwWjfk/tieh6d0tvVlv8ApF4c7QwGrXitDnyz0aWuBdYdw9UJM2xhw0je53atyAfVxvPogDq43n0QG5AYyd0+BQEJAZwd4c/ZATEBX85M3oqkaYtHPqDwNfBw2hbFORKt+eDmZ3Ta8lbXiXyedZRydLTv0JW6Pwu1tPgV1a7YzW0eRyMS2iWpoiLIa7QIQCEiUASAEAISJQAQkSAFAEhIIBISbqOkkmeGRNL3nYPc7gqSmorbMtVM7ZdsFs9CzXzSZCRLNaScWLRrYw8N54rnXZLl4XB6jB6VGn75+WW0LVOwRqnvcvqgNSAlwd0c/dAbEAICH0zt/oEA2yOJAJwJsdWpAb+hbu9SgMZGBouMCNSA09M7f6BAZxHSNnYi192KAVVQRStLJGB7TrBuVaMnF7Ritphau2a2il5bzKLTpUrrg3PRuOPJ23mt6rM9pHnsvobX3Uv/AEVKpppInFsjHMcNjgR5b1vRnGXDODZTOt6mmjSrGMSEAhIlABCRIAQAoAkJEgMo43OIa1rnOOpoBcTyChvXJaMHJ6S2WnImZUspDqg9EzXojGQ+Oxq07ctLxE7eL0ac/us8IvmTckwU7NCKMNG03JcfE6ytGdkpvbPRUY1dEdQRvl7FtHC977fdUM5r6Z2/0CA2xNDhd2JvbdggM+hbu9SgNL3lpIBsBqQGPTO3+gQB0zt/oEBggMo9Y8QgJqA1z908vdAREBtpu9y+iAlICPVbOfyQEOppo5W6MjGvbucAVaM3HhmKymuxamtnCq8yIJAXQvdC6+r/ABGeRN/VbUMyS8Pyci/olUvMHor9bmZWR91rZW/yuAPkVsxy63ycm3o2RDjycaooJ4zaSKVnixwHms6sg+GaM8a2HiUWRVbaMLi1yCkgFAEo2W0zdDSSPNmRyPJ+Fjneyq5xXLMkaLJcRZ16LNCtl1xiJu97gPQYrFLJrib1XScifK1/ksFHmGxo0p5XSEW7LBoN89Z9FrTzG/0o6lHQ4L/6PZ36HJ8MAtFG1g3gYnxOsrVlZKXLOxTjVVfoiT6bvHw+ioZyUgI9Vs5/JAaEBJpdR8fogNyAhz948vZAYIAQAgMo9Y8QgJqA1z908vdAREBtpu9y+iAlICPVbOfyQGhASKfUfH6IDYFDC4ItT+bl7LLDkw3/AKSjZz7ea6FHB5bO5Kits5AlALBm1rH97QsFp0sHk9EotTfEe651h6qjgnrAjaMJ+6eXupIIqEm2m73L6ICUgI9Vs5/JAaEBJpdR8fogNyAhz948vZAYIAQH/9k='
                  }
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href={'/register'}>Register</Link>
          <Link href={'/login'}>Login</Link>
        </div>
      )}
    </div>
  );
}
