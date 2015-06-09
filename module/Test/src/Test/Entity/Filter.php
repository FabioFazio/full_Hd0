<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** @ORM\Entity */
class Filter {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $responce;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $question;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $node;
	
	/** @ORM\ManyToOne(targetEntity="Filter", inversedBy="responces")
	 *  @ORM\JoinColumn(name="askedBy_id", referencedColumnName="id") 
	 */
	protected $askedBy;
	
	/** @ORM\OneToMany(targetEntity="Filter", mappedBy="askedBy") */
	protected $responces;
	
	/** @ORM\OneToMany(targetEntity="Queue", mappedBy="filter") */
	protected $queues;
	
	public function __construct(){
		$this->responces = new ArrayCollection();
		$this->node = false;
	}

	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }

    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getResponce(){
    	return $this->responce;
    }
    
    public function setResponce($responce){
    	$this->responce = $responce;
    }

    public function getQuestion(){
    	return $this->question;
    }
    
    public function setQuestion($question){
    	$this->question = $question;
    }
    
    public function isNode(){
    	return $this->node;
    }
    
    public function setNode($node){
    	$this->node = $node;
    }
    
    public function getAskedBy(){
    	return $this->askedBy;
    }
    
    public function setAskedBy($askedBy){
    	
        if($askedBy === null) {
        	if($this->askedBy !== null) {
        		$this->askedBy->getResponces()->removeElement($this);
        	}
        	$this->askedBy = null;
        } else {
        	if(!($askedBy instanceof \Test\Entity\Filter)) {
        		throw new InvalidArgumentException(
        		        '$askedBy must be null or instance of Test\Entity\Filter');
        	}
        	if($this->askedBy !== null) {
        		$this->askedBy->getResponces()->removeElement($this);
        	}
        	$this->askedBy = $askedBy;
        	$askedBy->getResponces()->add($this);
        }
    }

    public function hasResponces() {
    	return $this->responces->count();
    }
    
    public function getResponces() {
    	return $this->responces;
    }

    public function hasQueues() {
    	return $this->queues->count();
    }
    
    public function getQueue() {
    	return $this->hasQueues()?$this->getQueues()->first():null;
    }
    
    public function getQueues() {
    	return $this->queues;
    }
    
    public function toArray()
    {
    	$array = get_object_vars($this);
    	
    	unset($array['__initializer__']);
    	unset($array['__cloner__']);
    	unset($array['__isInitialized__']);

    	
    	unset($array['askedBy']);
    	$array['responce'] = !$array['responce']?null:htmlentities($array['responce'], ENT_HTML401);
    	$array['question'] = !$array['question']?null:htmlentities($array['question'], ENT_HTML401);

    	$array['responces'] = [];
    	
    	if ($this->hasResponces()){
    		foreach ($this->getResponces() as $resp){
    		    $array['responces'][] = $resp->toArray();
    		}
    	}
    	
    	$array['queue_id'] = $this->getQueue()?$this->getQueue()->getId():null;
    	unset($array['queues']);
    
    	return $array;
    }
}