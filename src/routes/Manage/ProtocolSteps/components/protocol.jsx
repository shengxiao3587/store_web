import React from 'react';
import { Checkbox, Collapse } from 'antd';
import './protocolSteps.scss';

const Panel = Collapse.Panel;

const protocol = (props) => {
  const {
    width = '',
    height = '',
    checked,
    checkboxStatus,
    handleChange,
    wealPolicyContent,
  } = props;
  return (
    <div className="shop-protocol-body">
      <Collapse defaultActiveKey={['1']}>
        <Panel header="服务协议" key="1">
          <div
            className="shop-protocol-body-1"
            style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', width, height }}
          >
            欢迎您使用浙江极配科技有限公司所有的兔波波网站、软件及服务（下称“兔波波”）。【审慎阅读】您在申请注册流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，
            特别是免除或者限制责任的条款、法律适用和争议解决条款。如您对协议有任何疑问，可向兔波波门店平台客服咨询。
            <br />
            【签约动作】当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与兔波波达成一致，成为兔波波平台“门店”。阅读本协议的过程中，
            如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。
            <br />
            兔波波门店平台所提供的各项服务的所有权和运营权，均归属于浙江极配科技有限公司。
            <br />
            本注册协议（以下简称“本协议”）系您因使用兔波波门店平台的各项服务而与兔波波门店平台订立的正式的、完整的协议。您在兔波波门店平台注册，即表示已充分阅读并接受本协议的所有条件和条款，并受本协议
            约束。您部分或全部不接受本协议条款的，您应立即停止注册程序。
            <br />
            本协议内容同时包括兔波波门店平台可能不断发布或更新的相关协议、业务规则等内容。上述内容一经正式发布，即为本协议不可分割的组成部分。
            <br />
            第一条 定义
            <br />
            1.1门店：该门店由您自付费用提供存货场地、人员、设备等线下资源，为兔波波用户提供代收货服务、代寄件服务及其他业务服务（以下简称您的门店）,门店在本协议中统称为“门店”。
            <br />
            1.2代收货服务：由消费者通过“兔波波平台”及其他线上入口授权您，或未通过上述方式授权，但通过线下授权快递员，委托您为其代收包裹且在一定时间内进行保存，待消费者自提的服务。
            <br />
            1.3代寄件服务：由消费者通过“兔波波平台”及其他授权您，或未通过上述方式授权，但直接前往您的门店，委托门店代寄符合国家运输标准法规的包裹且在快递员揽走包裹前对包裹进行保存的服务。
            <br />
            1.4 其他业务：由“兔波波平台”官方通过兔波波平台系统发布的活动、任务，包括但不限于扫码购、业务激励赛、品牌落地推广、上门取件等活动形式，您自行在兔波波系统报名、开展并最终通过结果审核的业务。
            <br />
            1.5服务商：指依据本协议约定经营门店的经营者。
            <br />
            第二条 合作内容
            <br />
            2.1您同意并确认：您为“兔波波平台”用户提供代收货和/或代寄件和/或其他业务服务，您是全部服务的主体。兔波波并不是您与兔波波用户之间缔结的任何合同、协议的当事方，因此兔波波对兔波波
            用户与您之间的权利义务无需承担任何担保或连带责任。如因您的原因造成兔波波以及兔波波用户的损失或引致第三方的索赔、诉讼等，您应承担全部法律责任并使兔波波免责。
            <br />
            2.2您同意并确认：您在兔波波系统设置的所有子账号的任何系统操作所产生的后果以及法律责任，由您本人承担。
            <br />
            2.3您同意并确认：如果合作期间您需要调整门店信息包括但不限于门店主营类型，店铺地址，营业时间，都需要符合最新的审核标准，若不满足要求，兔波波有权终止本协议。
            <br />
            2.4您同意并确认：您从事任何非本协议约定的服务内容，包括但不限于您门店的主营业务、非用户线上授权包裹处理等，其获得的收益、风险以及产生的所有责任均由您自行承担及处理。
            <br />
            第三条 业务流程
            <br />
            3.1代收货流程：
            <br />
            3.1.1如兔波波用户未线上授权您为其提供代收货服务的包裹，包裹到达您门店后，您需与用户确认是否接受自提服务，如用户要求送货上门，您应为用户提供免费送货上门服务或退还快递公司进行处理。具体要求如下：
            <br />
            3.1.1.1您在门店开通后，需持续7天对用户进行电话告知包裹已到达门店及门店详细信息，同时确认是否接受自提服务。
            <br />
            3.1.1.2在门店开通7天后产生的包裹首次到站的用户，需对用户进行电话告知包裹已到达门店详细信息，同时确认是否接受自提服务。
            <br />
            3.1.2您的门店收货时，须检查包裹外包装是否完好，包括但不限于是否存在破损件，液体渗漏，是否被拆过等情况（仅以包裹表面查看），如出现前述情况（从外部判断），应拒绝签收。如您交付收件人时，快
            件出现前述外包装破损、液体渗漏、包裹被拆过等情况，则您应向收件人承担全部赔偿责任。您和用户针对代收货服务的权利义务通过附件一《兔波波门店运营规则》进行详细描述，不在协议正文具体体现。
            <br />
            3.1.3您收货后，须在包裹到达门店后的2个小时内通过兔波波平台系统录入包裹，系统将通过短信或兔波波微信公众号等通知兔波波用户至您处取货以及相应取货密码。您同意并确认，您代兔波波用户签收快件后
            ，快件的相关保管责任即转移至您，您应尽到合理的保管义务。如兔波波用户对快件主张相应权利（包括但不限于快件短缺、丢失、破损等），您应自行负责解决，与极配、兔波波无关。如您不能妥善处理纠纷情况，兔
            波波保留终止您使用代收货系统录入包裹的权利，情节严重的，兔波波有权解除本协议。
            <br />
            3.1.4您为兔波波用户提供代收货服务，不得私自向消费者收取兔波波规定以外的任何费用。
            <br />
            3.1.5您应保证门店每天8:00-22:00期间至少有10小时为用户提供代收货相关服务。
            <br />
            3.1.6兔波波用户领取包裹时，需向您提供正确的取货密码，您须予以核实。如密码正确且用户信息核对无误，则您应将包裹提交该兔波波用户，予以签收并即时在系统中进行签收操作。原则上，为证明您已将包裹
            提交用户，您应在兔波波用户签收时，要求其在签收凭证上签字，您应保存兔波波用户的签收凭证。如兔波波用户称自身未收到货而向兔波波投诉，您应提供兔波波用户已经签收的相应证明（如签收凭证等）。
            <br />
            3.1.7您的门店需配置相应监控设备，监控设备的视频文件保存时间不得低于30天。您有义务配合国家相关部门随时调阅您的监控信息。
            <br />
            3.2代寄件流程：
            <br />
            3.2.1您在门店设定专门接收快件窗口，并指定对接人提供代寄件服务。您为兔波波用户提供有偿代寄件服务，您应向兔波波用户充分告知收费标准以及计算方式并在店内显著位置公示。
            <br />
            3.2.2您接收兔波波用户授权您代寄件的快件时，须检查快件外包装是否完好，包括但不限于是否存在快件破损，液体渗漏等情况。如出现上述情况，您应拒绝代寄件。您一旦接收兔波波用户的快件，即表示快件外包装完好。
            <br />
            3.2.3您应按照《快递安全生产操作规范》国家标准以及相关法律法规和邮政管理部门的规定，提示兔波波用户出示身份证确保实名制寄件，您收取兔波波用户代寄的快件时，必须验视内件物品是否符合法律、行政法规以及
            国务院和国务院有关部门关于禁止寄递或者限制寄递物品的规定。您保证严格按照国家邮政局、公安部、国家安全部发布的《禁止寄递物品管理规定》及其他相关法律法规的规定接收兔波波用户快件,以避免交接给物流公司的
            快件发生导致物流公司或第三方人员和财产损害的情形（例如爆炸物、硫酸等），否则，由此造成的相关损失均由您负责承担。同时要求寄件人填写内件详细信息，同时在“寄件人签名”一栏以正楷签字确认，您须根据用户申报内
            容对交寄的物品、包装物、填充物等进行实物验视，保证内件物品与客户填写的内件详情一致，同时在“揽件人签名”一栏以正楷签字确认，否则，您将可能承担相应法律责任。同时您需对签收凭证（扫描件或拍照件）提供至少3个月的保管。
            <br />
            3.2.4在您与寄件人完成交接后至您将代寄的快件交接给快递公司或快递员前，您应对兔波波用户投递的快件妥善保管。如兔波波用户对快件主张相应权利（包括但不限于快件短缺、丢失、破损等），您应自行负责解决，与兔波
            波无关。如您不能妥善处理纠纷情况，兔波波保留终止您使用兔波波系统录入包裹的权利，情节严重的，兔波波有权解除本协议。
            <br />
            3.2.5您收货后，在指定时间内通过兔波波系统录入包裹，并将快件交付物流配送。物流取走包裹时，您应要求快递员在“揽件人签名”一栏以正楷签字确认，同时您需对签收凭证（扫描件或拍照件）提供至少3个月的保管。物流
            取走后，您需要在指定时间内在兔波波系统回传运单号。
            <br />
            3.2.6您在提供寄件服务时，应当询问用户寄件商品价值，对于用户声明价值超过1000元/单的商品，您有义务对用户进行保价告知。若未按要求操作产生的用户投诉，应遵循兔波波门店运营规则进行赔付。
            <br />
            3.2.7您应妥善保管代寄包裹，若因保管不当导致包裹丢失、破损等，应遵循兔波波门店运营规则进行赔付。
            <br />
            3.3其他业务合作流程：
            <br />
            其他业务包括但不限于扫码购、业务激励赛、品牌落地推广、拼团等活动形式。其他业务的合作流程以在兔波波系统发布活动、任务等形式发布，由您自行报名开展，不单独签署协议。
            <br />
            第四条 平台系统使用费
            <br />
            4.1为有效履行本协议，保证在代收货、代寄件服务过程中兔波波用户的商品安全，以及使用兔波波平台系统及品牌，您同意向兔波波支付系统使用费即人民币0元。并在7日内完成向兔波波指定账号缴费，逾期未缴，兔波波有权立
            即解除本协议且注销您的兔波波账号。
            <br />
            4.2协议有效期间，门店主动退出兔波波平台，或因违规导致的兔波波解除协议情况下，兔波波无需退还系统平台使用费。
            <br />
            第五条 兔波波权利义务
            <br />
            5.1兔波波有权根据自己独立的判断，因时、因地制宜的对兔波波系统进行改进。
            <br />
            5.2兔波波有权为履行本协议在极配、兔波波的网站上使用您的商标、标识等资料。
            <br />
            5.3兔波波将根据实际需要，为您的门店服务人员进行相关培训。
            <br />
            5.4兔波波有权管理您的服务质量和对您的门店业绩指标进行考核，兔波波在合作期间内有权不定时抽检您对投诉的处理及服务质量，一经发现您未按兔波波要求进行投诉的处理，兔波波有权责令您立即进行整改，情节严重或整改
            后仍不能达到兔波波要求的，兔波波有权解除本协议，并追究您的违约责任。
            <br />
            第六条 您的权利义务
            <br />
            6.1 您需提供不低于10平米的包裹操作及存放面积；您需协助完成兔波波系统与您原有系统对接，或配备兔波波系统所需要的机具；及宣传资料的分发与张贴。
            <br />
            6.2 您需确保您只代收门店周边500米的消费者的包裹，超过500米的消费者包裹不允许录入兔波波系统，并要求消费者自提。
            <br />
            6.3您每天都需要在兔波波系统设定的营业时间内正常营业，若根据自身运营状态，需要临时停止代收货、代寄件服务，应提前至少7个工作日在兔波波系统内设置为临时关闭状态并在店外张贴暂停营业告示, 如您未提前临时关闭
            引起的客诉，责任由您自行承担。
            <br />
            6.4 您有义务按兔波波实际要求进行张贴相关物料，如您拒不履行，兔波波有权终止双方合作，解除协议，同时兔波波有权暂停提供对您履约所需的技术服务。
            <br />
            6.5除非兔波波明确授权可使用兔波波提供的推广材料，您不得使用兔波波及其关联公司或其产品、服务的名称、商标、标识、版权、特殊图案、域名或相似的名称、商标、标识、版权、特殊图案、域名等。如您未得兔波波允许
            ，将兔波波标识用于包括但不限于装修、物料制作等用途，兔波波有权要求您拆除装修，销毁物料。
            <br />
            6.6未得兔波波书面允许，本协议有效期内，您不得与兔波波或其关联公司存在直接或间接竞争关系的法律实体（该等法律实体包括但不限于菜鸟、京东、熊猫快收、逗妮开心等及其相关经营者及关联公司）进行相关业务合作，
            否则兔波波有权立即提前终止双方合同，解除本协议，并无需退还平台系统使用费及保留追究您违约责任的权利，本款所指相关业务约定为本协议涉及的合作内容。
            <br />
            6.7您在为用户提供代收货服务时，需严格按照“3.1代收货流程”的约定执行，否则需按照附件一《兔波波门店运营规则》关于投诉与赔付的约定向兔波波用户进行赔付。
            <br />
            6.8您须在接收到用户包裹且验视合格确定包裹为可代寄状态的24小时内将包裹交付给您合作的快递公司或快递员。存在不可抗力、快递原因等因素时除外，否则需按照《兔波波门店运营规则》关于代寄件延迟约定向兔波波用户
            进行赔付。 您将包裹交给合作快递公司快递员后如发生包裹丢失（含少件）、破损、快递公司服务态度等问题，可建议消费者自行联系相应快递公司协商解决，兔波波及其关联公司不承担相关责任，您不承担相关责任，您需配合协调解决。
            <br />
            6.9为后续门店形象升级，您的门店需预留有可装修的位置，包括但不限于广告框、形象墙、前台贴面等。
            <br />
            6.10 您郑重承诺，您在兔波波页面所登记的全部信息都是准确和真实的，如因您填写信息错误或提供虚假信息（包括但不限于上传非本门店照片，填写非本店铺地址，门店类型填错，地图位置错误，电话号码错误等），由此引
            致的所有责任由您承担，兔波波并保留就此追究您相关违约责任的权利。如您在兔波波页面所登记的任何信息有变动，您需在信息变动后3天内告知兔波波并在兔波波系统中进行修正。如您未及时修正，视同为提供虚假信息。
            <br />
            6.11在业务发展过程中，涉及到与服务有关的任何规则、要求等的更新或变化，兔波波会在兔波波服务平台页面进行公示和更新，上述规则、要求亦与本协议具备同样效力，您应及时查阅并承诺认真遵守，且您同意兔波波对服务规
            则、要求等的更新无需事先征得您同意，但应在更新或变化时及时告知您。
            <br />
            6.12 您接受并认可兔波波及兔波波授权相关方对于门店的评价，评价分数以兔波波系统最终输出的分数为准。
            <br />
            6.13您有权在本协议合法签署并生效后，要求兔波波通过技术手段将您添加至兔波波系统。
            <br />
            第七条 投诉、赔付及门店清退
            <br />
            您成为兔波波门店后必须严格遵守《兔波波门店运营规则》，对于兔波波门店的入驻、退出、服务质量要求和投诉赔付、处罚等，均以《兔波波门店运营规则》的约定为准。您同意并确认，兔波波有权根据实际需要重新制定或更新《兔
            波波门店运营规则》及其他相关规则，并以网站公示的形式进行公告，请您及时查看。更新后的上述规则和/或其他相关规则一经在兔波波系统公布后，立即自动生效。
            <br />
            第八条 知识产权
            <br />
            8.1您同意并确认，兔波波和/或其关联公司以书面和/
            <br />或非书面形式提供给您的任何资料、信息、内容、设计、数据及其相关的知识产权（包括但不限于商标权、服务标志、商号、字号、企业名称、版权、专利权、植物新品种权、集成电路布图设计等甲方和/或其关联公司的智力劳
            动成果所享有的专有权）归属于兔波波和/或其关联公司，您不享有任何权利。
            <br />
            8.2为维护兔波波统一品牌形象，若您因履行本协议之目的需要使用兔波波品牌，您需将使用兔波波品牌的每项拟定稿件、文案或设计图必须事前提交兔波波审批，取得兔波波的书面同意后，方能使用、发布或上线。若因您违规使用兔波
            波品牌导致兔波波或第三方遭受损失的，您应负责全额赔偿。
            <br />
            8.3 “兔波波”所涉知识产权归属于浙江极配科技有限公司；门店在经营行为中使用的“兔波波”名称，以及使用的由“兔波波”提供的或带有“兔波波”标识、Logo、Icon、设计、图形等知识产权归属于浙江极配科技有限公司。
            <br />
            第九条 保密责任
            <br />
            9.1未经对方书面许可，本协议及附件内容任何一方不得将本协议内容透露给第三方。
            <br />
            9.2任何一方对于因签署或履行本协议而了解或接触到的对方的商业秘密及其他机密资料和信息（以下简称“保密信息”，包括但不限于公司商业模式，商业计划，财务预算和模式，计算机程序，源代码，运算法则，员工、专家、客户和潜
            在客户的名单及专长，方法，方式，步骤，创意，发明（无论是否取得专利），图表和其他技术，商业，财务和产品发展计划，预算，策略和信息）均应保守秘密；非经对方书面同意，任何一方不得向第三方泄露、给予或转让该等保密信
            息（不限传达方式及是否为草稿或最终确认稿）。
            <br />
            9.3双方承诺在本协议终止之后仍然继续承担在此条款下的保密义务。甲乙双方有权对对方故意或过失泄露商业机密所造成的损失提出赔偿。
            <br />
            第十条 不可抗力
            <br />
            10.1由于无法预见的不可抗力事件，例如战争、地震、罢工、动乱或司法、政府限制等不能预见、不能避免且不能克服的事件发生，导致任何一方不能履行本合同中的部分或全部义务时，应及时通知对方，受上述事件影响一方在本协
            议项下的义务在不可抗力引起的延误期内应中止履行，履行期限应自动延长，延长的时间与该中止期相等，并无需就此承担违约责任。
            <br />
            10.2不可抗力持续15天以上，双方均可以书面通知对方或兔波波在兔波波门店系统公示的方式终止本合同。
            <br />
            第十一条 协议终止与违约责任
            <br />
            11.1双方均有权提前7天通过书面通知另一方或兔波波在兔波波系统告知或门店在兔波波门店系统自行申请退出的方式终止本协议且无需承担违约责任。本协议终止后，双方应立即停止使用对方所拥有的知识产权，如商标、企业标识等。
            <br />
            您提交的终止本协议通知后７个工作日内，必须按照兔波波规定，在兔波波系统中设置临时关闭且兔波波有权对您的门店操作临时关闭，并对本协议终止前兔波波用户已经选择的您的服务地点服务履行本协议约定的义务，并承担相应责任。
            <br />
            11.2如您违反本协议中的任何条款，兔波波有权立即解除本协议且无需退还您已支付的费用。您应在本协议终止后的一个月内将全部由兔波波或其关联公司提供的名称、标识、LOGO等信息的推广材料或其他书面、电子材料自行销毁、删
            除或交回兔波波。
            <br />
            11.3如您违反本协议任何条款，给兔波波、兔波波用户造成损失的，您应当承担全部的赔偿责任。如兔波波承担了上述责任，则您同意赔偿兔波波的相关支出和损失，包括合理的律师费用。
            <br />
            11.4您理解并同意，兔波波有权直接扣取您门店补贴费用相应金额，用以支付以上违约及赔偿。若门店补贴不足以支付以上违约及赔偿的，您仍应继续承担违约及赔偿责任。
            <br />
            11.5 您理解并同意，兔波波有权对合作门店类型及门店软硬件进行要求，如您的门店条件不符，兔波波有权随时终止合作并不承担任何违约责任。
            <br />
            11.6在业务发展过程中，双方对在本协议中未约定事宜及需要重新补充约定的事宜，兔波波会在兔波波门店系统页面要求您签署补充协议，如您对补充协议不认可，则认为您提前终止本协议，双方即刻停止合作；如您放弃签署或未按
            时签署，则认为您认可该协议，双方将按照新的补充协议进行合作。
            <br />
            第十二条 不当利益条款
            <br />
            您不得向兔波波及其关联企业之员工、顾问提供任何形式的不正当利益，如有，则您同意兔波波有权立即解除本协议，并由您按(a)本协议总价款的30％；或(b)提供任何形式的不正当利益的总金额，两者中较高的一项向兔波波赔偿。
            <br />
            第十三条 争议解决
            <br />
            双方在履行本协议过程中发生的任何争议应通过友好协商方式解决，如协商不成，双方将该争议提交浙江极配科技有限公司所在地人民法院裁决。
            <br />
            第十四条 其他
            <br />
            14.1 本协议有效期自2018年4月1日至2019年3月31日。
            <br />
            14.2 若您与兔波波有签订其他协议，协议内容与本协议有冲突的，以本协议为准。
            <br />
            14.3本协议附件是本协议的有效组成部分，与本协议具备同等法律效力；兔波波已发布或将来可能发布的各类规则、规范、补充协议、通知或提示均为本协议不可分割的组成部分，与本协议具备同等法律效力。
            <br />
            14.4兔波波可在提前五个工作日通知您的前提下，将本协议的权利义务转让给第三方，您对此不持任何异议。
            <br />
            附件一：《兔波波门店运营规则》
            <br />
            一、门店运营规则：
            <br />
            为明确门店运营状态，同时给予门店明确的成长周期管理指导，将门店成长周期对应的阶段明确如下：
            <br />
            门店状态：待设立（未支付平台系统使用费）、运营中、临时关闭、退出
            <br />
            （一）待设立：
            <br />
            1、定义：指完成门店设立审核，但未完成平台系统使用费缴纳。
            <br />
            2、考核规则：7日内门店未完成平台系统使用费缴纳，兔波波有权对门店进行清退、注销。
            <br />
            3、考核标准：平台系统使用费缴纳。
            <br />
            （二）运营中：
            <br />
            定义：指门店完成入驻审核，且完成平台系统使用费缴纳。
            <br />
            考核规则：门店持续60个自然日日均单量低于40单，兔波波有权清退、注销门店账号；门店持续30个自然日日均单量低于20单，兔波波有权清退、注销门店账号。
            <br />
            考核标准：门店包裹单量
            <br />
            注：门店包裹单量指录入兔波波系统并完成完结操作的单量，遇春节等重大节假日，节假日不例入考核日期。
            <br />
            （三）临时关闭：
            <br />
            定义：指门店因节假日或个人原因，对门店进行暂时性关闭
            <br />
            考核规则：门店连续临时关闭时间达15个自然日、或门店一个季度内临时关闭时间达30个自然日，兔波波有权清退、注销门店账号
            <br />
            考核标准：门店临时关闭时间
            <br />
            （四）退出：
            <br />
            定义：指门店自主退出兔波波门店平台，或门店因违规操作被兔波波清退、注销，以及按运营规则实行清退、注销后的门店状态
            <br />
            考核规则：门店自主申请退出；运营规则中清退规则
            <br />
            考核标准：门店清退规则
            <br />

            二、门店清退规则：
            <br />
            （一）清退定义：指导门店因违规操作被兔波波清退、注销
            <br />
            （二）清退标准：
            <br />
            1、门店出现刷单等虚假操作获取扶持费用等行为；
            <br />
            2、门店使用、加入“兔波波”之外平台系统，且不服从整改等行为；
            <br />
            3、门店出现重大投诉事件，且造成一定负面影响的情形。
            <br />
          </div>
        </Panel>
        {
          wealPolicyContent &&
          <Panel header="补贴政策" key="2">
            <p
              className="shop-protocol-body-1"
              style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', width, height }}
            >
              {wealPolicyContent}
            </p>
          </Panel>
        }
      </Collapse>
      <Checkbox
        checked={checked}
        disabled={checkboxStatus}
        onChange={handleChange}
        className="circle"
      >我已认真阅读并同意上述协议</Checkbox>
    </div>
  );
};
export default protocol;
